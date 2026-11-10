import { describeChanged, describeFailed, describeSkipped } from '../../collect/infrastructure/cli/detail-refresh-printer';
import { attentionItemsOf, type DailyCheckResult, type DetailCheckOutcome, type ReviewOutcome } from '../application/daily-check.service';

import type { ReviewItem } from '../../benefit/application/benefit-review.service';
import type { ReviewStatusKind } from '../../benefit/domain/review-status';
import type { ReportPrinter } from '../../collect/infrastructure/cli/report-printer';

const ATTENTION_LABEL: Partial<Record<ReviewStatusKind, string>> = {
  SOURCE_CHANGED: '원본 바뀜',
  SOURCE_REMOVED: '원본 사라짐',
  SOURCE_MISSING: '원본 없음',
};

// 수집 보고서 아래에 상세 확인과 혜택 검토 요약을 붙인다
export class DailyCheckPrinter {
  constructor(
    private readonly reportPrinter: ReportPrinter,
    private readonly maxItems = 20,
  ) {}

  // 로그에서 검색하기 쉽게 고정된 영어 문구와 숫자만 담은 한 줄
  summaryLine({ collection, details, review }: DailyCheckResult): string {
    const reviewPart = review.status === 'failed' ? 'review=failed' : `review=ok attention=${attentionItemsOf(review.queue).length}`;
    return (
      `Daily check finished: sources=${collection.outcomes.length} failed=${collection.failed.length}` +
      ` changes=${collection.totalChanges} ${detailsPartOf(details)} ${reviewPart}`
    );
  }

  print(result: DailyCheckResult, at: Date): string {
    return [
      this.reportPrinter.print(result.collection, at),
      '',
      ...this.detailLines(result.details),
      '',
      ...this.reviewLines(result.review),
    ].join('\n');
  }

  private detailLines(details: DetailCheckOutcome): string[] {
    if (details.status === 'failed') return [`✘ 상세 확인 실패: ${details.reason}`];

    const { outcomes, changed, failed, skipped } = details.report;
    const counts = `다시 받음 ${outcomes.length}건 (변경 ${changed.length} · 실패 ${failed.length}), ${describeSkipped(skipped)}`;
    if (changed.length === 0 && failed.length === 0) return [`상세 확인: ${counts}`];

    return [
      `⚠ 상세 확인: ${counts}`,
      ...this.listed('바뀐 상세', changed.map(describeChanged)),
      ...this.listed('받지 못한 상세', failed.map(describeFailed)),
    ];
  }

  // 많으면 정해진 수만 보여주고 나머지는 건수로
  private listed(title: string, lines: string[]): string[] {
    if (lines.length === 0) return [];
    const shown = lines.slice(0, this.maxItems);
    const hidden = lines.length - shown.length;
    return [`  ${title}`, ...shown, ...(hidden > 0 ? [`    … 외 ${hidden}건`] : [])];
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

function detailsPartOf(details: DetailCheckOutcome): string {
  if (details.status === 'failed') return 'details=failed';
  const { outcomes, skipped, changed, failed } = details.report;
  return `details=refetched:${outcomes.length},skipped:${skipped.upToDate},changed:${changed.length},failed:${failed.length}`;
}

function describe(item: ReviewItem): string {
  const { status } = item;
  const fields = status.kind === 'SOURCE_CHANGED' ? [...new Set(status.changes.flatMap((c) => c.fields.map((f) => f.field)))] : [];
  return `    ${ATTENTION_LABEL[status.kind]}  ${item.name}${fields.length ? ` (${fields.join(', ')})` : ''}`;
}
