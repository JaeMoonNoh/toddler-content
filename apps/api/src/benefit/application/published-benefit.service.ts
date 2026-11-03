import { Injectable } from '@nestjs/common';

import { RegionService } from '../../region/application/region.service';
import { isPublishable, type PublishedStatusKind } from '../domain/review-status';

import { BenefitRepository } from './ports/benefit.repository';
import { SourceStateReader } from './ports/source-state.reader';

import type { ApplicationPeriod } from '../domain/application-period';
import type { Audience } from '../domain/audience';
import type { BenefitAmount } from '../domain/benefit-amount';
import type { BenefitSchedule } from '../domain/benefit-schedule';
import type { EligibilityCondition } from '../domain/eligibility-condition';
import type { HowToApply } from '../domain/how-to-apply';

export interface PublishedBenefit {
  slug: string;
  name: string;
  regionCode: string;
  regionName: string; // 예: 청주시, 충청북도, 전국
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
    private readonly regions: RegionService,
  ) {}

  async list(): Promise<PublishedBenefit[]> {
    const benefits = await this.repository.findAll();
    const current = await this.reader.read(benefits.flatMap((benefit) => benefit.sources));
    const tree = await this.regions.tree();

    return benefits
      .flatMap((benefit) => {
        const status = benefit.reviewStatus(current);
        if (!isPublishable(status)) return [];
        return {
          slug: benefit.slug,
          name: benefit.name,
          regionCode: benefit.regionCode,
          // NOTE: 지역 목록을 새로 받으면서 코드가 사라졌어도 게시는 멈추지 않는다 (sync가 다시 막는다)
          regionName: tree.has(benefit.regionCode) ? tree.get(benefit.regionCode).name : benefit.regionCode,
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
