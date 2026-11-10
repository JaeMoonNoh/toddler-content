// 매일 확인할 때 어떤 상세를 다시 받을지 정하는 비즈니스 정책

import type { DetailSourceId, SourceId } from '../../../shared/domain/source-id';
import type { StoredItem } from '../../domain/source-record';
import type { DetailTarget } from '../detail-refresh-report';
import type { StoredDetail } from '../ports/detail.repository';

// 목록에 수정일이 없는 출처는 이 날수가 지나면 다시 받는다. 매일 모두 받으면 호출이 너무 많아 한 주에 한 번씩 돌린다
export const DETAIL_ROTATION_DAYS = 7;

// 지자체 복지로는 목록과 상세 모두에 수정일(YYYYMMDD)이 있다
const LAST_MODIFIED_FIELD = 'lastModYmd';

const DAY_MS = 24 * 60 * 60 * 1000;

export type DetailDecision = 'due' | 'upToDate' | 'unlisted';

export interface DetailRefreshPlan {
  due: DetailTarget[];
  upToDate: DetailTarget[];
  unlisted: DetailTarget[]; // 목록에서 사라졌거나 목록에 없다. 사라진 것은 목록 비교가 이미 알린다
}

export interface KnownDetails {
  detailSources: readonly DetailSourceId[];
  listed: ReadonlyMap<string, StoredItem>; // detailKeyOf로 찾는다
  stored: ReadonlyMap<string, StoredDetail>;
}

export function detailKeyOf({ source, externalId }: { source: SourceId; externalId: string }) {
  return `${source}:${externalId}`;
}

// 상세를 받을 수 없는 출처(보조금24는 목록에 본문이 다 있다)는 어느 쪽에도 넣지 않는다
export function planDetailRefresh(watched: readonly DetailTarget[], known: KnownDetails, at: Date): DetailRefreshPlan {
  const plan: DetailRefreshPlan = { due: [], upToDate: [], unlisted: [] };
  const detailSources: readonly SourceId[] = known.detailSources;
  for (const target of watched) {
    if (!detailSources.includes(target.source)) continue;
    const key = detailKeyOf(target);
    plan[decide(known.listed.get(key), known.stored.get(key), at)].push(target);
  }
  return plan;
}

function decide(listItem: StoredItem | undefined, stored: StoredDetail | undefined, at: Date): DetailDecision {
  if (!listItem || listItem.removed) return 'unlisted';
  if (!stored) return 'due';

  const listed = lastModifiedOf(listItem.payload);
  const fetched = lastModifiedOf(stored.payload);
  if (listed && fetched) return listed === fetched ? 'upToDate' : 'due';
  return isRotationDue(stored.fetchedAt, at) ? 'due' : 'upToDate';
}

function lastModifiedOf(payload: Record<string, unknown>): string | null {
  const value = payload[LAST_MODIFIED_FIELD];
  return typeof value === 'string' && value !== '' ? value : null;
}

// NOTE: 날짜만 비교한다. 시각까지 비교하면 매일 같은 시각에 돌아도 몇 초 차이로 하루씩 밀린다
function isRotationDue(fetchedAt: Date, at: Date) {
  return daysBetween(fetchedAt, at) >= DETAIL_ROTATION_DAYS;
}

function daysBetween(from: Date, to: Date) {
  return Math.round((Date.parse(kstDateOf(to)) - Date.parse(kstDateOf(from))) / DAY_MS);
}

function kstDateOf(at: Date) {
  return at.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
}
