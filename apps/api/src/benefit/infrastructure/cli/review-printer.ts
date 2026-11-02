import { formatKstDate } from '../../../shared/format-kst';
import type { ReviewItem, ReviewQueue } from '../../application/review-queue.use-case';
import type { RetireResult } from '../../application/retire-benefits.use-case';
import type { SyncResult } from '../../application/sync-catalog.use-case';
import type { VerifyResult } from '../../application/verify-benefits.use-case';
import type { ReviewStatusKind } from '../../domain/review-status';
import type { SourceRef } from '../../domain/source-ref';

const STATUS_LABEL: Record<ReviewStatusKind, string> = {
  SOURCE_MISSING: '원본 없음 (수집된 적 없는 ID, 게시 안 함)',
  SOURCE_REMOVED: '원본 사라짐 (출처에서 종료됐을 수 있음, 게시 멈춤)',
  SOURCE_CHANGED: '원본 바뀜 (마지막 확인 내용으로 게시 중)',
  UNVERIFIED: '확인 전 ("검증 전"으로 게시 중)',
  VERIFIED: '확인됨',
};

const COUNT_LABEL: Record<ReviewStatusKind, string> = {
  VERIFIED: '확인됨',
  UNVERIFIED: '확인 전',
  SOURCE_CHANGED: '원본 바뀜',
  SOURCE_REMOVED: '원본 사라짐',
  SOURCE_MISSING: '원본 없음',
};

const MAX_VALUE = 80;

// 혜택 검토 명령의 결과를 사람이 읽는 글로 바꾼다
export class ReviewPrinter {
  printSync(result: SyncResult): string {
    const lines = [
      `혜택 목록 반영: 새로 등록 ${result.registered.length} · 수정 ${result.revised.length} · 대상 묶음만 바뀜 ${result.regrouped.length} · 그대로 ${result.unchanged}`,
    ];
    if (result.revised.length) lines.push(`수정된 혜택은 다시 "검증 전"으로 바뀌었습니다: ${result.revised.join(', ')}`);
    if (result.notInCatalog.length) {
      lines.push(`목록 파일에 없는 혜택 (DB와 사이트에는 남아 있음): ${result.notInCatalog.join(', ')}`);
      lines.push(`사이트에서 빼려면: pnpm benefit retire ${result.notInCatalog.join(' ')}`);
    }
    return lines.join('\n');
  }

  printQueue(queue: ReviewQueue): string {
    const counts = (Object.keys(COUNT_LABEL) as ReviewStatusKind[]).map((kind) => `${COUNT_LABEL[kind]} ${queue.counts[kind]}`);
    const lines = [`혜택 검토 (${counts.join(' · ')})`];
    if (queue.items.length === 0) return [...lines, '확인할 혜택이 없습니다.'].join('\n');

    let section: ReviewStatusKind | null = null;
    for (const item of queue.items) {
      if (item.status.kind !== section) {
        section = item.status.kind;
        lines.push('', STATUS_LABEL[section]);
      }
      lines.push(...linesOf(item));
    }
    lines.push('', '혜택 하나 자세히 보기: pnpm benefit review <slug>', '원문을 확인했으면: pnpm benefit verify <slug> [<slug> ...]');
    return lines.join('\n');
  }

  printRetire(result: RetireResult): string {
    const lines = result.retired.length ? [`✔ ${result.retired.length}건 삭제: ${result.retired.join(', ')}`] : [];
    lines.push(...result.failed.map(({ slug, reason }) => `✘ ${slug}: ${reason}`));
    return lines.length ? lines.join('\n') : '지울 slug를 넣어 주세요.';
  }

  printVerify(result: VerifyResult, at: Date): string {
    const lines = result.verified.length ? [`✔ ${result.verified.length}건 확인 (${formatKstDate(at)}): ${result.verified.join(', ')}`] : [];
    lines.push(...result.failed.map(({ slug, reason }) => `✘ ${slug}: ${reason}`));
    return lines.length ? lines.join('\n') : '확인할 slug를 넣어 주세요.';
  }
}

function linesOf(item: ReviewItem): string[] {
  const verified = item.verifiedAt ? `  (마지막 확인 ${formatKstDate(item.verifiedAt)})` : '';
  const head = `  ${item.slug}  ${item.name}${verified}`;
  const { status } = item;

  if (status.kind === 'SOURCE_MISSING' || status.kind === 'SOURCE_REMOVED') {
    return [head, ...status.refs.map((ref) => `      ${describeRef(ref)}`)];
  }
  if (status.kind === 'SOURCE_CHANGED') {
    return [
      head,
      ...status.changes.flatMap((change) => [
        `      ${describeRef(change.ref)}`,
        ...change.fields.map((f) => `        ${f.field}: ${shorten(f.before)} → ${shorten(f.after)}`),
      ]),
    ];
  }
  return [head];
}

function describeRef(ref: SourceRef) {
  return `${ref.label} ${ref.externalId}`;
}

function shorten(value: unknown) {
  const text = JSON.stringify(typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : (value ?? null));
  return text.length > MAX_VALUE ? `${text.slice(0, MAX_VALUE)}…` : text;
}
