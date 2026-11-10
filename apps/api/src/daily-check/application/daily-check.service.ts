import { Injectable } from '@nestjs/common';

import { BenefitCatalogService } from '../../benefit/application/benefit-catalog.service';
import { BenefitReviewService, type ReviewItem, type ReviewQueue } from '../../benefit/application/benefit-review.service';
import { needsAttention } from '../../benefit/domain/review-status';
import { CollectService } from '../../collect/application/collect.service';
import { SourceDetailService } from '../../collect/application/source-detail.service';

import type { CollectionReport } from '../../collect/application/collection-report';
import type { DetailRefreshReport } from '../../collect/application/detail-refresh-report';

export type ReviewOutcome = { status: 'succeeded'; queue: ReviewQueue } | { status: 'failed'; reason: string };

export type DetailCheckOutcome = { status: 'succeeded'; report: DetailRefreshReport } | { status: 'failed'; reason: string };

export interface DailyCheckResult {
  collection: CollectionReport;
  details: DetailCheckOutcome;
  review: ReviewOutcome;
}

// 매일 할 일: 공공 API 목록을 수집하고, 혜택이 가리키는 원본 중 바뀌었을 것 같은 상세를 다시 받고,
// 그 결과로 사람이 확인해야 할 혜택이 생겼는지 본다.
// 수집과 혜택 검토는 서로를 모르고, 차례로 부르는 것만 여기서 한다
@Injectable()
export class DailyCheckService {
  constructor(
    private readonly collect: CollectService,
    private readonly details: SourceDetailService,
    private readonly catalog: BenefitCatalogService,
    private readonly review: BenefitReviewService,
  ) {}

  async run(at = new Date()): Promise<DailyCheckResult> {
    const collection = await this.collect.collectAll();
    const details = await this.toDetailOutcome(at);
    return { collection, details, review: await this.toReviewOutcome() };
  }

  // 상세는 목록을 수집한 뒤에 받아야 목록의 수정일과 비교할 수 있다.
  // 상세를 못 받아도 수집·검토 결과는 알려야 하므로 오류를 결과로 바꾼다
  private async toDetailOutcome(at: Date): Promise<DetailCheckOutcome> {
    try {
      const watched = await this.catalog.linkedSources(this.details.detailSources);
      return { status: 'succeeded', report: await this.details.refreshStale(watched, at) };
    } catch (error) {
      return { status: 'failed', reason: error instanceof Error ? error.message : String(error) };
    }
  }

  // 검토 목록을 못 만들어도 수집 결과는 알려야 하므로 오류를 결과로 바꾼다
  private async toReviewOutcome(): Promise<ReviewOutcome> {
    try {
      return { status: 'succeeded', queue: await this.review.queue() };
    } catch (error) {
      return { status: 'failed', reason: error instanceof Error ? error.message : String(error) };
    }
  }
}

// 확인한 뒤로 원본이 바뀌었거나 사라진 혜택. 검증 전인 혜택은 매일 바뀌는 소식이 아니라서 넣지 않는다
export function attentionItemsOf(queue: ReviewQueue): ReviewItem[] {
  return queue.items.filter((item) => needsAttention(item.status));
}

// 수집 실패, 상세 변경·실패, 검토 실패, 확인 필요 혜택 중 하나라도 있으면 눈에 띄게 알린다
export function requiresAttention({ collection, details, review }: DailyCheckResult): boolean {
  return (
    collection.hasFailures ||
    details.status === 'failed' ||
    details.report.changed.length > 0 ||
    details.report.failed.length > 0 ||
    review.status === 'failed' ||
    attentionItemsOf(review.queue).length > 0
  );
}
