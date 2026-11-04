// 출처에서 새로 받은 항목 한 건
export interface SourceRecord {
  externalId: string;
  name: string;
  payload: Record<string, unknown>;
}

// 이전 수집까지 알고 있던 항목 한 건
export interface StoredItem {
  externalId: string;
  name: string;
  payload: Record<string, unknown>;
  removed: boolean;
}
