import { Injectable, Logger } from '@nestjs/common';

import { CollectionEvents } from '../../application/ports/collection-events';

import type { SourceId } from '../../../shared/domain/source-id';
import type { CollectSourceResult } from '../../application/collection-report';

// 수집 진행을 한 줄씩 남긴다. 실행 ID(run)로 DB의 CollectionRun과 맞춰 볼 수 있다
@Injectable()
export class LoggingCollectionEvents extends CollectionEvents {
  private readonly logger = new Logger('Collection');
  private readonly startedAt = new Map<string, number>();

  started(source: SourceId, runId: string) {
    this.startedAt.set(runId, performance.now());
    this.logger.log(`Collection started: source=${source} run=${runId}`);
  }

  succeeded(result: CollectSourceResult) {
    const { source, runId, itemCount, added, updated, removed, baseline, duplicateIds } = result;
    this.logger.log(
      `Collection succeeded: source=${source} run=${runId} items=${itemCount} added=${added} updated=${updated} removed=${removed}` +
        ` duplicates=${duplicateIds.length} baseline=${baseline} duration=${this.elapsed(runId)}`,
    );
  }

  failed(source: SourceId, runId: string, reason: string) {
    this.logger.error(`Collection failed: source=${source} run=${runId} duration=${this.elapsed(runId)} reason=${reason}`);
  }

  private elapsed(runId: string) {
    const startedAt = this.startedAt.get(runId);
    this.startedAt.delete(runId);
    return startedAt === undefined ? '-' : `${((performance.now() - startedAt) / 1000).toFixed(1)}s`;
  }
}
