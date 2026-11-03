import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CollectService } from '../application/collect.service';
import { SnapshotRepository } from '../application/ports/snapshot.repository';
import { SOURCE_FETCHERS, SourceFetcher } from '../application/ports/source-fetcher';
import { ReportPrinter } from './cli/report-printer';
import { HttpClient } from './http/http-client';
import { PrismaSnapshotRepository } from './persistence/prisma-snapshot.repository';
import { BokjiroLocalFetcher, BokjiroNationalFetcher } from './sources/bokjiro/bokjiro.fetcher';
import { Gov24Fetcher } from './sources/gov24/gov24.fetcher';
import { ServiceKey } from './sources/service-key';

@Module({
  providers: [
    CollectService,
    { provide: SnapshotRepository, useClass: PrismaSnapshotRepository },
    { provide: HttpClient, useFactory: () => new HttpClient() },
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
    { provide: ReportPrinter, useFactory: () => new ReportPrinter() },
  ],
  exports: [CollectService, ReportPrinter],
})
export class CollectModule {}
