import { Injectable } from '@nestjs/common';

import { isPublishable, type PublishedStatusKind } from '../domain/review-status';

import { BenefitRepository } from './ports/benefit.repository';
import { SourceStateReader } from './ports/source-state.reader';

import type { ApplicationPeriod } from '../domain/application-period';
import type { Audience } from '../domain/audience';
import type { BenefitScope } from '../domain/benefit';
import type { BenefitAmount } from '../domain/benefit-amount';
import type { BenefitSchedule } from '../domain/benefit-schedule';
import type { EligibilityCondition } from '../domain/eligibility-condition';
import type { HowToApply } from '../domain/how-to-apply';

export interface PublishedBenefit {
  slug: string;
  name: string;
  scope: BenefitScope;
  sourceName: string;
  sourceUrl: string;
  verifiedAt: Date | null;
  // VERIFIED: 확인됨, UNVERIFIED: "검증 전"으로 표시, SOURCE_CHANGED: 확인 뒤 출처 내용이 바뀌어 다시 확인 중
  reviewStatus: PublishedStatusKind;
  schedule: BenefitSchedule | null;
  conditions: EligibilityCondition[];
  amount: BenefitAmount | null;
  applicationPeriod: ApplicationPeriod | null;
  howToApply: HowToApply | null;
  audience: Audience | null;
}

// 사이트에 보여줄 혜택. 원본이 사라졌거나 없는 혜택만 빠진다
@Injectable()
export class PublishedBenefitService {
  constructor(
    private readonly repository: BenefitRepository,
    private readonly reader: SourceStateReader,
  ) {}

  async list(): Promise<PublishedBenefit[]> {
    const benefits = await this.repository.findAll();
    const current = await this.reader.read(benefits.flatMap((benefit) => benefit.sources));

    return benefits
      .flatMap((benefit) => {
        const status = benefit.reviewStatus(current);
        if (!isPublishable(status)) return [];
        return {
          slug: benefit.slug,
          name: benefit.name,
          scope: benefit.scope,
          sourceName: benefit.primarySource.label,
          sourceUrl: benefit.sourceUrl,
          verifiedAt: benefit.verifiedAt,
          reviewStatus: status.kind,
          schedule: benefit.schedule,
          conditions: benefit.conditions,
          amount: benefit.amount,
          applicationPeriod: benefit.applicationPeriod,
          howToApply: benefit.howToApply,
          audience: benefit.audience,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }
}
