import type { CollectSourceUseCase } from './collect-source.use-case';
import { CollectionReport, type SourceOutcome } from './collection-report';
import type { SourceFetcher } from './ports/source-fetcher';

export class CollectionAlreadyRunningError extends Error {
  constructor() {
    super('이미 수집이 진행 중입니다.');
  }
}

export class CollectAllSourcesUseCase {
  private running = false;

  constructor(
    private readonly collectSource: CollectSourceUseCase,
    private readonly fetchers: readonly SourceFetcher[],
  ) {}

  async execute(): Promise<CollectionReport> {
    if (this.running) throw new CollectionAlreadyRunningError();
    this.running = true;
    try {
      const outcomes: SourceOutcome[] = [];
      for (const fetcher of this.fetchers) outcomes.push(await this.collect(fetcher));
      return new CollectionReport(outcomes);
    } finally {
      this.running = false;
    }
  }

  private async collect(fetcher: SourceFetcher): Promise<SourceOutcome> {
    try {
      return { source: fetcher.source, status: 'succeeded', result: await this.collectSource.execute(fetcher) };
    } catch (error) {
      return { source: fetcher.source, status: 'failed', reason: error instanceof Error ? error.message : String(error) };
    }
  }
}
