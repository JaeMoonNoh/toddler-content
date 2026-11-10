import { formatKst } from '../../../shared/format-kst';

import { SOURCE_LABEL } from './report-printer';

import type { DetailRefreshReport, FailedDetail, RefreshedDetail, SkippedDetails } from '../../application/detail-refresh-report';

type ChangedDetail = Extract<RefreshedDetail, { status: 'changed' }>;

// 상세 받기 결과를 사람이 읽는 글로 바꾼다. 바뀐 항목과 실패는 빠짐없이 모두 보여준다
export function printDetailRefresh(report: DetailRefreshReport, at: Date): string {
  const { fetched, baseline, unchanged, changed, failed } = report;
  const lines = [
    `상세 받기 결과 (${formatKst(at)})`,
    `대상 ${report.outcomes.length}건: 받음 ${fetched.length} (처음 받음 ${baseline.length} · 그대로 ${unchanged.length} · 변경 ${changed.length}) · 실패 ${failed.length}`,
  ];
  if (hasSkipped(report.skipped)) lines.push(describeSkipped(report.skipped));
  if (changed.length > 0) lines.push('변경', ...changed.map(describeChanged));
  if (failed.length > 0) lines.push('실패', ...failed.map(describeFailed));
  return lines.join('\n');
}

export function hasSkipped({ upToDate, unlisted }: SkippedDetails) {
  return upToDate + unlisted > 0;
}

export function describeSkipped({ upToDate, unlisted }: SkippedDetails) {
  return `건너뜀 ${upToDate + unlisted}건: 바뀌지 않았을 것 ${upToDate} · 목록에 없음 ${unlisted}`;
}

export function describeChanged(c: ChangedDetail) {
  return `    ${SOURCE_LABEL[c.source]}  ${c.name || c.externalId} (${c.externalId}): ${c.fields.join(', ')}`;
}

export function describeFailed(f: FailedDetail) {
  return `    ${SOURCE_LABEL[f.source]}  ${f.externalId}: ${f.reason}`;
}
