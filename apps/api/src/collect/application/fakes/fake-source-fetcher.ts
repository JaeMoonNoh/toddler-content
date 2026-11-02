import type { SourceId, SourceRecord } from '../../domain/source-record';
import { SourceFetcher } from '../ports/source-fetcher';

type Response = SourceRecord[] | Error;

// 호출될 때마다 준비해 둔 응답을 차례로 돌려준다. 마지막 응답은 계속 반복한다.
export class FakeSourceFetcher extends SourceFetcher {
  calls = 0;
  private waiting: Promise<void> | null = null;

  constructor(
    readonly source: SourceId,
    private readonly responses: Response[],
    readonly ignoredFields: readonly string[] = ['조회수'],
  ) {
    super();
  }

  holdUntil(signal: Promise<void>) {
    this.waiting = signal;
    return this;
  }

  async fetchAll(): Promise<SourceRecord[]> {
    const response = this.responses[Math.min(this.calls, this.responses.length - 1)];
    this.calls += 1;
    if (this.waiting) await this.waiting;
    if (response instanceof Error) throw response;
    return response;
  }
}
