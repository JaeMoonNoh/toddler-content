import { Injectable, Logger } from '@nestjs/common';

import { DetailEvents } from '../../application/ports/detail-events';

import type { FailedDetail, RefreshedDetail } from '../../application/detail-refresh-report';

// 상세를 받은 결과를 한 건씩 남긴다
@Injectable()
export class LoggingDetailEvents extends DetailEvents {
  private readonly logger = new Logger('SourceDetail');

  refreshed(detail: RefreshedDetail) {
    const fields = detail.status === 'changed' ? ` fields=${detail.fields.join(',')}` : '';
    this.logger.log(`Detail refreshed: source=${detail.source} id=${detail.externalId} status=${detail.status}${fields}`);
  }

  failed({ source, externalId, reason }: FailedDetail) {
    this.logger.warn(`Detail refresh failed: source=${source} id=${externalId} reason=${reason}`);
  }
}
