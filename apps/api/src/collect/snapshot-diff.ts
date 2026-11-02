import { createHash } from 'node:crypto';

// 출처에서 새로 받은 항목 한 건
export interface SourceRecord {
  externalId: string;
  name: string;
  payload: Record<string, unknown>;
}

// DB에 저장돼 있던 항목 한 건
export interface StoredItem {
  externalId: string;
  hash: string;
  payload: Record<string, unknown>;
  removed: boolean;
}

export interface FieldChange {
  field: string;
  before: unknown;
  after: unknown;
}

export interface SnapshotDiff {
  added: SourceRecord[]; // 처음 보거나, 사라졌다가 다시 나타난 항목
  updated: { record: SourceRecord; changedFields: FieldChange[] }[];
  removed: StoredItem[];
  unchanged: SourceRecord[];
  duplicateIds: string[]; // 같은 ID가 두 번 이상 온 경우 (첫 번째만 사용)
}

// 키 순서와 상관없이 같은 내용이면 같은 문자열이 나오도록 정렬해서 직렬화
function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    return `{${Object.keys(obj)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value ?? null);
}

function withoutIgnored(payload: Record<string, unknown>, ignored: readonly string[]) {
  const copy = { ...payload };
  for (const field of ignored) delete copy[field];
  return copy;
}

export function hashPayload(payload: Record<string, unknown>, ignored: readonly string[] = []): string {
  return createHash('sha256').update(stableStringify(withoutIgnored(payload, ignored))).digest('hex');
}

export function changedFields(
  before: Record<string, unknown>,
  after: Record<string, unknown>,
  ignored: readonly string[] = [],
): FieldChange[] {
  const fields = new Set([...Object.keys(before), ...Object.keys(after)]);
  for (const field of ignored) fields.delete(field);
  return [...fields]
    .sort()
    .filter((field) => stableStringify(before[field]) !== stableStringify(after[field]))
    .map((field) => ({ field, before: before[field] ?? null, after: after[field] ?? null }));
}

export function diffSnapshot(
  previous: StoredItem[],
  current: SourceRecord[],
  ignored: readonly string[] = [],
): SnapshotDiff {
  const prevById = new Map(previous.map((p) => [p.externalId, p]));
  const seen = new Set<string>();
  const diff: SnapshotDiff = { added: [], updated: [], removed: [], unchanged: [], duplicateIds: [] };

  for (const record of current) {
    if (seen.has(record.externalId)) {
      diff.duplicateIds.push(record.externalId);
      continue;
    }
    seen.add(record.externalId);

    const prev = prevById.get(record.externalId);
    if (!prev || prev.removed) {
      diff.added.push(record);
    } else if (prev.hash !== hashPayload(record.payload, ignored)) {
      diff.updated.push({ record, changedFields: changedFields(prev.payload, record.payload, ignored) });
    } else {
      diff.unchanged.push(record);
    }
  }

  for (const prev of previous) {
    if (!prev.removed && !seen.has(prev.externalId)) diff.removed.push(prev);
  }
  return diff;
}

// API 장애로 목록이 일부만 왔을 때 대량 삭제로 오인하지 않도록 막는다
export function assertNotShrunk(previousActive: number, currentCount: number, minRatio = 0.9) {
  if (previousActive > 0 && currentCount < previousActive * minRatio) {
    throw new Error(
      `받은 항목 수(${currentCount})가 이전(${previousActive})의 ${minRatio * 100}% 미만이라 수집을 중단했습니다. API 응답을 확인하세요.`,
    );
  }
}
