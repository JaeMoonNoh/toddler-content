import type { SourceId, SourceRecord } from '../../domain/source-record';

export abstract class SourceFetcher {
  abstract readonly source: SourceId;
  // 매일 바뀌어서 변경으로 보면 안 되는 필드 (예: 조회수)
  abstract readonly ignoredFields: readonly string[];

  abstract fetchAll(): Promise<SourceRecord[]>;
}
