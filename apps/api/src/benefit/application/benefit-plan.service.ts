import { Injectable } from '@nestjs/common';

import { RegionService } from '../../region/application/region.service';
import { missingQuotes } from '../domain/plan-quote';

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

export interface PlanWithSources extends CardToPlan {
  plan: BenefitPlan;
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

  // 그 지역과 아래 지역의 카드 중 아직 일정·금액을 정리하지 않은 것
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

  // 근거로 적은 문구가 원문에 그대로 있는지. 넣는 것을 막지는 않고, 다시 보라고 알린다
  async quoteProblems(plans: BenefitPlan[]): Promise<PlanProblem[]> {
    const sourceTexts = new Map((await this.withSources(plans)).map(({ plan, sources }) => [plan.slug, sourceTextOf(sources)]));
    return plans.flatMap((plan) =>
      (['schedule', 'amount', 'applicationPeriod'] as const).flatMap((field) => {
        const basis = plan[field]?.basis.text;
        const source = sourceTexts.get(plan.slug);
        if (!basis || source === undefined) return [];
        return missingQuotes(basis, source).map((quote) => ({
          slug: plan.slug,
          problem: `${field}: 원문에 없는 인용 "${quote.slice(0, 60)}"`,
        }));
      }),
    );
  }

  // 초안과 그 카드, 원문을 함께 준다. 다른 검토자가 원문과 대조할 때 쓴다. 혜택 목록에 없는 slug는 뺀다
  async withSources(plans: BenefitPlan[]): Promise<PlanWithSources[]> {
    const cards = new Map((await this.catalog.load()).map((card) => [card.slug, card]));
    const known = plans.flatMap((plan) => {
      const card = cards.get(plan.slug);
      return card ? [{ plan, card }] : [];
    });
    const current = await this.sources.read(known.flatMap(({ card }) => card.sources));
    return known.map(({ plan, card }) => ({
      plan,
      card,
      sources: card.sources.map((ref) => ({ ref, payload: current.of(ref)?.payload ?? null })),
    }));
  }

  // 초안에 문제가 하나라도 있으면 아무것도 넣지 않는다
  // today: YYYY-MM-DD. 올해는 today의 앞 네 자리
  async apply(plans: BenefitPlan[], today: string): Promise<string[]> {
    const problems = await this.check(plans, today.slice(0, 4));
    if (problems.length)
      throw new CatalogError(
        `초안에 문제가 있어 넣지 않았습니다\n- ${problems.map(({ slug, problem }) => `${slug}: ${problem}`).join('\n- ')}`,
      );

    const cards = new Map((await this.catalog.load()).map((card) => [card.slug, card]));
    await this.catalog.update(plans.map((plan) => plan.applyTo(cards.get(plan.slug)!, today)));
    return plans.map((plan) => plan.slug);
  }
}

function sourceTextOf(sources: CardToPlan['sources']): string {
  return sources.flatMap(({ payload }) => Object.values(payload ?? {}).filter((value) => typeof value === 'string')).join('\n');
}

// NOTE: plannedOn을 남기기 전에 정리한 카드는 날짜가 없어서, 값이 하나라도 있으면 정리한 것으로 본다
function isPlanned(card: BenefitDetails) {
  return card.plannedOn !== null || card.schedule !== null || card.amount !== null || card.applicationPeriod !== null;
}
