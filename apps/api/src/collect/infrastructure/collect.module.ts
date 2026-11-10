import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HttpClient, type RetryNotice } from '../../shared/infrastructure/http-client';
import { ServiceKey } from '../../shared/infrastructure/service-key';
import { CollectService } from '../application/collect.service';
import { CollectionEvents } from '../application/ports/collection-events';
import { DetailEvents } from '../application/ports/detail-events';
import { DETAIL_FETCHERS, DetailFetcher } from '../application/ports/detail-fetcher';
import { DetailRepository } from '../application/ports/detail.repository';
import { SnapshotRepository } from '../application/ports/snapshot.repository';
import { SOURCE_FETCHERS, SourceFetcher } from '../application/ports/source-fetcher';
import { SourceDetailService } from '../application/source-detail.service';

import { ReportPrinter } from './cli/report-printer';
import { LoggingCollectionEvents } from './logging/logging-collection-events';
import { LoggingDetailEvents } from './logging/logging-detail-events';
import { PrismaDetailRepository } from './persistence/prisma-detail.repository';
import { PrismaSnapshotRepository } from './persistence/prisma-snapshot.repository';
import { BokjiroLocalDetailFetcher, BokjiroNationalDetailFetcher } from './sources/bokjiro/bokjiro-detail.fetcher';
import { BokjiroLocalFetcher, BokjiroNationalFetcher } from './sources/bokjiro/bokjiro.fetcher';
import { Gov24Fetcher } from './sources/gov24/gov24.fetcher';

const httpLogger = new Logger('HttpClient');

function logRetry({ attempt, retries, delayMs, reason }: RetryNotice) {
  httpLogger.warn(`HTTP retry ${attempt}/${retries} in ${delayMs}ms: ${reason}`);
}

@Module({
  providers: [
    CollectService,
    { provide: SnapshotRepository, useClass: PrismaSnapshotRepository },
    { provide: CollectionEvents, useClass: LoggingCollectionEvents },
    { provide: HttpClient, useFactory: () => new HttpClient(fetch, { onRetry: logRetry }) },
    {
      provide: ServiceKey,
      useFactory: (config: ConfigService) => new ServiceKey(config.getOrThrow<string>('DATA_GO_KR_SERVICE_KEY')),
      inject: [ConfigService],
    },
    {
      provide: SOURCE_FETCHERS,
      useFactory: (http: HttpClient, key: ServiceKey): SourceFetcher[] => [
        new Gov24Fetcher(http, key),
        new BokjiroNationalFetcher(http, key),
        new BokjiroLocalFetcher(http, key),
      ],
      inject: [HttpClient, ServiceKey],
    },
    SourceDetailService,
    { provide: DetailRepository, useClass: PrismaDetailRepository },
    { provide: DetailEvents, useClass: LoggingDetailEvents },
    {
      provide: DETAIL_FETCHERS,
      useFactory: (http: HttpClient, key: ServiceKey): DetailFetcher[] => [
        new BokjiroNationalDetailFetcher(http, key),
        new BokjiroLocalDetailFetcher(http, key),
      ],
      inject: [HttpClient, ServiceKey],
    },
    { provide: ReportPrinter, useFactory: () => new ReportPrinter() },
  ],
  exports: [CollectService, SourceDetailService, ReportPrinter],
})
export class CollectModule {}
