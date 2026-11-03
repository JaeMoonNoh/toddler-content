import type { ComparisonRule, FieldChange } from '../../shared/domain/comparison-rule';

import type { SourceRecord, StoredItem } from './source-record';

// 무엇을 "바뀌었다"고 볼지 정하는 규칙. 저장 방식이나 수집 방식과 무관한 순수 함수만 둔다.

export interface SnapshotDiff {
  added: SourceRecord[]; // 처음 보거나, 사라졌다가 다시 나타난 항목
  updated: { record: SourceRecord; changedFields: FieldChange[] }[];
  removed: StoredItem[];
  unchanged: SourceRecord[];
  duplicateIds: string[]; // 같은 ID가 두 번 이상 온 경우 (첫 번째만 사용)
}

export function diffSnapshot(previous: StoredItem[], current: SourceRecord[], rule: ComparisonRule): SnapshotDiff {
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
    } else if (rule.isSame(prev.payload, record.payload)) {
      diff.unchanged.push(record);
    } else {
      diff.updated.push({ record, changedFields: rule.changedFields(prev.payload, record.payload) });
    }
  }

  for (const prev of previous) {
    if (!prev.removed && !seen.has(prev.externalId)) diff.removed.push(prev);
  }
  return diff;
}
