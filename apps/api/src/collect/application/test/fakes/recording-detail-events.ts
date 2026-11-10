import { DetailEvents } from '../../ports/detail-events';

import type { FailedDetail, RefreshedDetail } from '../../detail-refresh-report';

// 알린 내용을 차례로 모아 둔다
export class RecordingDetailEvents extends DetailEvents {
  readonly events: string[] = [];

  refreshed({ source, externalId, status }: RefreshedDetail) {
    this.events.push(`${status} ${source} ${externalId}`);
  }

  failed({ source, externalId, reason }: FailedDetail) {
    this.events.push(`failed ${source} ${externalId} ${reason}`);
  }
}
