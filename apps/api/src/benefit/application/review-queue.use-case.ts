import type { Benefit } from '../domain/benefit';
import { needsReview, type ReviewStatus, type ReviewStatusKind } from '../domain/review-status';
import type { BenefitRepository } from './ports/benefit.repository';
import type { SourceStateReader } from './ports/source-state.reader';

export interface ReviewItem {
  slug: string;
  name: string;
  verifiedAt: Date | null;
  status: ReviewStatus;
}

export interface ReviewQueue {
  items: ReviewItem[]; // 급한 것부터
  counts: Record<ReviewStatusKind, number>;
}

// 게시가 멈춘 것(원본 없음, 사라짐)부터, 그 다음 게시 중이지만 내용이 바뀐 것, 마지막이 아직 안 올린 것
const URGENCY: ReviewStatusKind[] = ['SOURCE_MISSING', 'SOURCE_REMOVED', 'SOURCE_CHANGED', 'UNVERIFIED', 'VERIFIED'];

// 사람이 확인해야 할 혜택 목록
export class ReviewQueueUseCase {
  constructor(
    private readonly repository: BenefitRepository,
    private readonly reader: SourceStateReader,
  ) {}

  async execute(): Promise<ReviewQueue> {
    const benefits = await this.repository.findAll();
    const current = await this.reader.read(benefits.flatMap((benefit) => benefit.sources));
    const all = benefits.map((benefit) => reviewItemOf(benefit, benefit.reviewStatus(current)));

    return {
      items: all.filter((item) => needsReview(item.status)).sort(byUrgencyThenName),
      counts: countByKind(all),
    };
  }
}

function reviewItemOf(benefit: Benefit, status: ReviewStatus): ReviewItem {
  return { slug: benefit.slug, name: benefit.name, verifiedAt: benefit.verifiedAt, status };
}

function byUrgencyThenName(a: ReviewItem, b: ReviewItem) {
  return URGENCY.indexOf(a.status.kind) - URGENCY.indexOf(b.status.kind) || a.name.localeCompare(b.name, 'ko');
}

function countByKind(items: ReviewItem[]) {
  const counts = Object.fromEntries(URGENCY.map((kind) => [kind, 0])) as Record<ReviewStatusKind, number>;
  items.forEach((item) => counts[item.status.kind]++);
  return counts;
}
