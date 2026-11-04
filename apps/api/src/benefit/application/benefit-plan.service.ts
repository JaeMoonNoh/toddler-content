import { Injectable } from '@nestjs/common';

import { RegionService } from '../../region/application/region.service';

import { CatalogError } from './benefit-catalog.service';
import { BenefitCatalog } from './ports/benefit-catalog';
import { SourceStateReader } from './ports/source-state.reader';

import type { Payload } from '../../shared/domain/comparison-rule';
import type { BenefitDetails } from '../domain/benefit';
import type { BenefitPlan } from '../domain/benefit-plan';
import type { SourceRef } from '../domain/source-ref';

// 일정·금액을 정리할 때 읽을 카드 한 장과 그 원본들
export interface CardToPlan {
  card: BenefitDetails;
  sources: { ref: SourceRef; payload: Payload | null }[]; // 수집돼 있지 않으면 payload가 null
}

export interface PlanProblem {
  slug: string;
  problem: string;
}

// 원문을 읽고 정리한 일정·금액 초안을 검사하고 혜택 목록에 넣는다
@Injectable()
export class BenefitPlanService {
  constructor(
    private readonly catalog: BenefitCatalog,
    private readonly sources: SourceStateReader,
    private readonly regions: RegionService,
  ) {}

  // 그 지역과 아래 지역의 카드 중 일정·금액·올해 신청 기간이 모두 비어 있는 것
  async cardsToPlan(regionCode: string): Promise<CardToPlan[]> {
    const area = new Set((await this.regions.tree()).selfAndDescendantsOf(regionCode).map((region) => region.code));
    const cards = (await this.catalog.load()).filter((card) => area.has(card.regionCode) && !isPlanned(card));
    const current = await this.sources.read(cards.flatMap((card) => card.sources));
    return cards.map((card) => ({ card, sources: card.sources.map((ref) => ({ ref, payload: current.of(ref)?.payload ?? null })) }));
  }

  async check(plans: BenefitPlan[], year: string): Promise<PlanProblem[]> {
    const cards = new Map((await this.catalog.load()).map((card) => [card.slug, card]));
    return plans.flatMap((plan, index) => {
      const card = cards.get(plan.slug);
      if (!card) return [{ slug: plan.slug, problem: '혜택 목록에 없는 slug입니다' }];
      if (plans.findIndex((other) => other.slug === plan.slug) !== index)
        return [{ slug: plan.slug, problem: '초안에 두 번 이상 있습니다' }];
      return plan.problemsFor(card, year).map((problem) => ({ slug: plan.slug, problem }));
    });
  }

  // 초안에 문제가 하나라도 있으면 아무것도 넣지 않는다
  async apply(plans: BenefitPlan[], year: string): Promise<string[]> {
    const problems = await this.check(plans, year);
    if (problems.length)
      throw new CatalogError(
        `초안에 문제가 있어 넣지 않았습니다\n- ${problems.map(({ slug, problem }) => `${slug}: ${problem}`).join('\n- ')}`,
      );

    const cards = new Map((await this.catalog.load()).map((card) => [card.slug, card]));
    await this.catalog.update(plans.map((plan) => plan.applyTo(cards.get(plan.slug)!)));
    return plans.map((plan) => plan.slug);
  }
}

function isPlanned(card: BenefitDetails) {
  return card.schedule !== null || card.amount !== null || card.applicationPeriod !== null;
}
