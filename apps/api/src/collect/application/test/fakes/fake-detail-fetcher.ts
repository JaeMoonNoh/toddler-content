import { DetailFetcher } from '../../ports/detail-fetcher';

import type { DetailSourceId } from '../../../../shared/domain/source-id';
import type { SourceRecord } from '../../../domain/source-record';

type Reply = Record<string, unknown> | Error;

// ID마다 준비해 둔 상세를 돌려준다. 준비하지 않은 ID는 출처 오류처럼 던진다
export class FakeDetailFetcher extends DetailFetcher {
  readonly requested: string[] = [];
  private readonly replies = new Map<string, Reply>();

  constructor(readonly source: DetailSourceId) {
    super();
  }

  reply(externalId: string, reply: Reply) {
    this.replies.set(externalId, reply);
    return this;
  }

  async fetchDetail(externalId: string): Promise<SourceRecord> {
    this.requested.push(externalId);
    const reply = this.replies.get(externalId);
    if (!reply) throw new Error(`${this.source}: 없는 항목입니다 (${externalId})`);
    if (reply instanceof Error) throw reply;
    return { externalId, name: typeof reply.servNm === 'string' ? reply.servNm : '', payload: reply };
  }
}
