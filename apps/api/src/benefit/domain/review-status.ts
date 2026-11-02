import type { FieldChange } from '../../collect/domain/source-record';
import type { SourceRef } from './source-ref';

export interface ChangedSource {
  ref: SourceRef;
  fields: FieldChange[];
}

// 사람이 확인한 뒤로 원본이 어떻게 됐는지
export type ReviewStatus =
  | { kind: 'VERIFIED' }
  | { kind: 'UNVERIFIED' } // 아직 아무도 확인하지 않았거나, 확인 뒤에 혜택 정보를 고쳤다
  | { kind: 'SOURCE_CHANGED'; changes: ChangedSource[] }
  | { kind: 'SOURCE_REMOVED'; refs: SourceRef[] } // 출처 목록에서 사라졌다 (종료됐을 수 있다)
  | { kind: 'SOURCE_MISSING'; refs: SourceRef[] }; // 수집된 적 없는 원본을 가리킨다 (ID가 틀렸을 수 있다)

export type ReviewStatusKind = ReviewStatus['kind'];

// 원본이 바뀌어도 마지막으로 확인한 내용과 확인일은 그대로 보여준다.
// 원본이 사라졌거나 한 번도 확인하지 않은 혜택은 보여주지 않는다.
const PUBLISHED: ReadonlySet<ReviewStatusKind> = new Set(['VERIFIED', 'SOURCE_CHANGED']);

export function isPublishable(status: ReviewStatus) {
  return PUBLISHED.has(status.kind);
}

export function needsReview(status: ReviewStatus) {
  return status.kind !== 'VERIFIED';
}
