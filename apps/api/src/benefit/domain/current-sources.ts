import type { Payload } from '../../shared/domain/comparison-rule';

import type { SourceRef } from './source-ref';

// 원본의 한 시점 모습. 사람이 확인할 때 이 모습을 그대로 남긴다
export interface SourceSnapshot {
  ref: SourceRef;
  payload: Payload; // 목록 항목
  detail: Payload | null; // 상세 본문 (복지로). 상세가 없는 출처이거나 아직 받지 않았으면 null
}

export interface SourceState extends SourceSnapshot {
  removed: boolean;
}

// 지금 수집돼 있는 원본들. 혜택의 상태는 이것과 비교해서 정한다
export class CurrentSources {
  private readonly byKey: ReadonlyMap<string, SourceState>;

  constructor(states: SourceState[]) {
    this.byKey = new Map(states.map((state) => [state.ref.key, state]));
  }

  of(ref: SourceRef): SourceState | undefined {
    return this.byKey.get(ref.key);
  }
}
