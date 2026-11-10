import type { SourceId } from '../../shared/domain/source-id';

export interface DetailTarget {
  source: SourceId;
  externalId: string;
}

export type RefreshedDetail = DetailTarget & { name: string } & (
    | { status: 'baseline' } // 처음 받아서 기준점만 저장했다
    | { status: 'unchanged' }
    | { status: 'changed'; fields: string[] }
  );

export type FailedDetail = DetailTarget & { status: 'failed'; reason: string };

export type DetailOutcome = RefreshedDetail | FailedDetail;

// 받지 않고 넘어간 대상. 전부 받을 때는 비어 있다
export interface SkippedDetails {
  upToDate: number; // 이전에 받은 뒤로 바뀌었을 것 같지 않다
  unlisted: number; // 출처 목록에서 사라졌거나 목록에 없다
}

const NONE_SKIPPED: SkippedDetails = { upToDate: 0, unlisted: 0 };

export class DetailRefreshReport {
  constructor(
    readonly outcomes: readonly DetailOutcome[],
    readonly skipped: SkippedDetails = NONE_SKIPPED,
  ) {}

  get fetched() {
    return this.outcomes.filter((o): o is RefreshedDetail => o.status !== 'failed');
  }

  get baseline() {
    return this.outcomes.filter((o) => o.status === 'baseline');
  }

  get unchanged() {
    return this.outcomes.filter((o) => o.status === 'unchanged');
  }

  get changed() {
    return this.outcomes.filter((o) => o.status === 'changed');
  }

  get failed() {
    return this.outcomes.filter((o) => o.status === 'failed');
  }
}
