import type { SourceId } from '../../../shared/domain/source-id';
import type { CollectSourceResult } from '../collection-report';

// 수집이 어디까지 진행됐는지 바깥에 알린다. 서버에서는 로그로 남긴다
export abstract class CollectionEvents {
  abstract started(source: SourceId, runId: string): void;
  abstract succeeded(result: CollectSourceResult): void;
  abstract failed(source: SourceId, runId: string, reason: string): void;
}
