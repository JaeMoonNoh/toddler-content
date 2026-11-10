import { ComparisonRule } from '../../shared/domain/comparison-rule';

import type { SourceSnapshot, SourceState } from './current-sources';
import type { SourceRef } from './source-ref';

// 상세를 비교하기 전에 확인한 원본에 지금 상세를 확인 당시 모습으로 채워도 되는지
//   ADOPTED: 목록 수정일이 상세 수정일과 같다. 확인한 뒤로 본문이 바뀌지 않았다는 증거가 있다
//   ASSUMED: 수정일이 없는 출처라 증거는 없지만 목록이 확인 당시 그대로라 본문도 그대로라고 본다
//   NEEDS_CHECK: 확인한 뒤로 바뀌었을 수 있다. 사람이 원문을 보고 다시 확인해야 한다
export type DetailAdoption = 'ADOPTED' | 'ASSUMED' | 'NEEDS_CHECK';

export interface AdoptedRef {
  ref: SourceRef;
  adoption: DetailAdoption;
}

const MODIFIED_ON = 'lastModYmd';

export function detailAdoptionOf(verified: SourceSnapshot, now: SourceState): DetailAdoption {
  const verifiedModifiedOn = verified.payload[MODIFIED_ON];
  if (verifiedModifiedOn !== undefined) return verifiedModifiedOn === now.detail?.[MODIFIED_ON] ? 'ADOPTED' : 'NEEDS_CHECK';
  return ComparisonRule.forReview(verified.ref.source).isSame(verified.payload, now.payload) ? 'ASSUMED' : 'NEEDS_CHECK';
}
