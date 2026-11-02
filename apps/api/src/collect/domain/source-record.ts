// 혜택 데이터를 주는 공공 API 출처
export type SourceId = 'GOV24' | 'BOKJIRO_NATIONAL' | 'BOKJIRO_LOCAL';

// 매일 바뀌어서 변경으로 보면 안 되는 필드 (조회수)
export const VOLATILE_FIELDS: Record<SourceId, readonly string[]> = {
  GOV24: ['조회수'],
  BOKJIRO_NATIONAL: ['inqNum'],
  BOKJIRO_LOCAL: ['inqNum'],
};

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
  hash: string;
  payload: Record<string, unknown>;
  removed: boolean;
}

export interface FieldChange {
  field: string;
  before: unknown;
  after: unknown;
}
