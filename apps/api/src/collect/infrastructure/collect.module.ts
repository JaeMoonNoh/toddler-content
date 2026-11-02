import { Module } from '@nestjs/common';
import { CollectAllSourcesUseCase } from '../application/collect-all-sources.use-case';
import { CollectSourceUseCase } from '../application/collect-source.use-case';
import { SnapshotRepository } from '../application/ports/snapshot.repository';
import { SourceFetcher } from '../application/ports/source-fetcher';
import { ReportPrinter } from './cli/report-printer';
import { HttpClient } from './http/http-client';
import { PrismaSnapshotRepository } from './persistence/prisma-snapshot.repository';
import { BokjiroLocalFetcher, BokjiroNationalFetcher } from './sources/bokjiro/bokjiro.fetcher';
import { Gov24Fetcher } from './sources/gov24/gov24.fetcher';
import { ServiceKey } from './sources/service-key';

const SOURCE_FETCHERS = Symbol('SOURCE_FETCHERS');

// application 층은 Nest를 모르므로 여기서 포트에 구현을 연결한다
@Module({
  providers: [
    { provide: SnapshotRepository, useClass: PrismaSnapshotRepository },
    { provide: HttpClient, useFactory: () => new HttpClient() },
    { provide: ServiceKey, useFactory: () => ServiceKey.fromEnv() },
    {
      provide: SOURCE_FETCHERS,
      useFactory: (http: HttpClient, key: ServiceKey | null): SourceFetcher[] => [
        new Gov24Fetcher(http, key),
        new BokjiroNationalFetcher(http, key),
        new BokjiroLocalFetcher(http, key),
      ],
      inject: [HttpClient, ServiceKey],
    },
    {
      provide: CollectSourceUseCase,
      useFactory: (repository: SnapshotRepository) => new CollectSourceUseCase(repository),
      inject: [SnapshotRepository],
    },
    {
      provide: CollectAllSourcesUseCase,
      useFactory: (collectSource: CollectSourceUseCase, fetchers: SourceFetcher[]) => new CollectAllSourcesUseCase(collectSource, fetchers),
      inject: [CollectSourceUseCase, SOURCE_FETCHERS],
    },
    { provide: ReportPrinter, useFactory: () => new ReportPrinter() },
  ],
  exports: [CollectAllSourcesUseCase, ReportPrinter],
})
export class CollectModule {}
