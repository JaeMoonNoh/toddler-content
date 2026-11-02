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

// 확인 전 혜택은 "검증 전"으로, 원본이 바뀐 혜택은 마지막 확인일과 함께 보여준다.
// 원본이 사라졌거나 수집된 적 없는 혜택만 보여주지 않는다.
const PUBLISHED = ['VERIFIED', 'UNVERIFIED', 'SOURCE_CHANGED'] as const;
export type PublishedStatusKind = (typeof PUBLISHED)[number];

export function isPublishable(status: ReviewStatus): status is Extract<ReviewStatus, { kind: PublishedStatusKind }> {
  return (PUBLISHED as readonly ReviewStatusKind[]).includes(status.kind);
}

export function needsReview(status: ReviewStatus) {
  return status.kind !== 'VERIFIED';
}

// 확인한 뒤로 원본에 무슨 일이 생긴 것. 매일 보고서에서 바로 알려야 하는 것들이다
const ATTENTION: ReadonlySet<ReviewStatusKind> = new Set(['SOURCE_CHANGED', 'SOURCE_REMOVED', 'SOURCE_MISSING']);

export function needsAttention(status: ReviewStatus) {
  return ATTENTION.has(status.kind);
}
