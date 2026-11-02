import type { ReviewItem } from '../../benefit/application/review-queue.use-case';
import type { ReviewStatusKind } from '../../benefit/domain/review-status';
import type { ReportPrinter } from '../../collect/infrastructure/cli/report-printer';
import { attentionItemsOf, type DailyCheckResult, type ReviewOutcome } from '../application/daily-check.use-case';

const ATTENTION_LABEL: Partial<Record<ReviewStatusKind, string>> = {
  SOURCE_CHANGED: '원본 바뀜',
  SOURCE_REMOVED: '원본 사라짐',
  SOURCE_MISSING: '원본 없음',
};

// 수집 보고서 아래에 혜택 검토 요약을 붙인다
export class DailyCheckPrinter {
  constructor(
    private readonly reportPrinter: ReportPrinter,
    private readonly maxItems = 20,
  ) {}

  print(result: DailyCheckResult, at: Date): string {
    return [this.reportPrinter.print(result.collection, at), '', ...this.reviewLines(result.review)].join('\n');
  }

  private reviewLines(review: ReviewOutcome): string[] {
    if (review.status === 'failed') return [`✘ 혜택 검토 실패: ${review.reason}`];

    const { queue } = review;
    const items = attentionItemsOf(queue);
    const unverified = `검증 전 ${queue.counts.UNVERIFIED}건`;
    if (items.length === 0) return [`혜택 검토: 확인 필요 없음 (${unverified})`];

    const breakdown = (Object.keys(ATTENTION_LABEL) as ReviewStatusKind[]).map((kind) => `${ATTENTION_LABEL[kind]} ${queue.counts[kind]}`);
    const shown = items.slice(0, this.maxItems).map(describe);
    const hidden = items.length - shown.length;
    return [
      `⚠ 혜택 검토: 확인 필요 ${items.length}건 (${breakdown.join(' · ')}), ${unverified}`,
      ...shown,
      ...(hidden > 0 ? [`    … 외 ${hidden}건`] : []),
      '자세히 보기: pnpm benefit review',
    ];
  }
}

function describe(item: ReviewItem): string {
  const { status } = item;
  const fields = status.kind === 'SOURCE_CHANGED' ? [...new Set(status.changes.flatMap((c) => c.fields.map((f) => f.field)))] : [];
  return `    ${ATTENTION_LABEL[status.kind]}  ${item.name}${fields.length ? ` (${fields.join(', ')})` : ''}`;
}
