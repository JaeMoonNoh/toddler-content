import { formatKst } from '../../../shared/format-kst';

import type { SourceId } from '../../../shared/domain/source-id';
import type { ChangedItem } from '../../application/collect.service';
import type { CollectionReport, SourceOutcome } from '../../application/collection-report';

const SOURCE_LABEL: Record<SourceId, string> = {
  GOV24: '보조금24',
  BOKJIRO_NATIONAL: '복지로 중앙부처',
  BOKJIRO_LOCAL: '복지로 지자체',
};

const CHANGE_LABEL: Record<ChangedItem['type'], string> = {
  ADDED: '추가',
  UPDATED: '변경',
  REMOVED: '삭제',
};

// 수집 보고서를 사람이 읽는 글로 바꾼다
export class ReportPrinter {
  constructor(private readonly maxChangesPerSource = 30) {}

  print(report: CollectionReport, at: Date): string {
    const lines = [`수집 결과 (${formatKst(at)})`];
    if (report.outcomes.length === 0) lines.push('수집할 출처가 없습니다.');
    for (const outcome of report.outcomes) lines.push(...this.linesOf(outcome));
    lines.push(this.summaryOf(report));
    return lines.join('\n');
  }

  private linesOf(outcome: SourceOutcome): string[] {
    const label = SOURCE_LABEL[outcome.source];
    if (outcome.status === 'failed') return [`✘ ${label} 실패: ${outcome.reason}`];

    const { result } = outcome;
    if (result.baseline) return [`✔ ${label} ${result.itemCount.toLocaleString()}건, 첫 수집이라 기준점만 저장`];

    const head = `✔ ${label} ${result.itemCount.toLocaleString()}건, 추가 ${result.added} · 변경 ${result.updated} · 삭제 ${result.removed}`;
    const shown = result.changes.slice(0, this.maxChangesPerSource).map(describeChange);
    const hidden = result.changes.length - shown.length;
    return [head, ...shown, ...(hidden > 0 ? [`    … 외 ${hidden}건`] : [])];
  }

  private summaryOf(report: CollectionReport): string {
    const failed = report.failed.length;
    return failed > 0 ? `실패한 출처 ${failed}곳, 전체 변경 ${report.totalChanges}건` : `전체 변경 ${report.totalChanges}건`;
  }
}

function describeChange(change: ChangedItem): string {
  const fields = change.fields.length > 0 ? ` (${change.fields.join(', ')})` : '';
  return `    ${CHANGE_LABEL[change.type]}  ${change.name || change.externalId}${fields}`;
}
