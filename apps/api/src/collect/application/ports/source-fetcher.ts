import type { SourceId } from '../../../shared/domain/source-id';
import type { SourceRecord } from '../../domain/source-record';

export abstract class SourceFetcher {
  abstract readonly source: SourceId;

  abstract fetchAll(): Promise<SourceRecord[]>;
}

// Nest가 출처 목록을 주입할 때 쓰는 토큰
export const SOURCE_FETCHERS = Symbol('SOURCE_FETCHERS');
