import { CollectionEvents } from '../../ports/collection-events';

import type { SourceId } from '../../../../shared/domain/source-id';
import type { CollectSourceResult } from '../../collection-report';

// 알린 내용을 차례로 모아 둔다
export class RecordingCollectionEvents extends CollectionEvents {
  readonly events: string[] = [];

  started(source: SourceId, runId: string) {
    this.events.push(`started ${source} ${runId}`);
  }

  succeeded(result: CollectSourceResult) {
    this.events.push(`succeeded ${result.source} ${result.runId}`);
  }

  failed(source: SourceId, runId: string, reason: string) {
    this.events.push(`failed ${source} ${runId} ${reason}`);
  }
}
