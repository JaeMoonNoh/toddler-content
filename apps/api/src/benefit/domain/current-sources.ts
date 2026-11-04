import type { Payload } from '../../shared/domain/comparison-rule';

import type { SourceRef } from './source-ref';

// 원본의 한 시점 모습. 사람이 확인할 때 이 모습을 그대로 남긴다
export interface SourceSnapshot {
  ref: SourceRef;
  payload: Payload;
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
