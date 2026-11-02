import { Module } from '@nestjs/common';
import { join } from 'node:path';
import { ListPublishedBenefitsUseCase } from '../application/list-published-benefits.use-case';
import { BenefitCatalog } from '../application/ports/benefit-catalog';
import { BenefitRepository } from '../application/ports/benefit.repository';
import { SourceStateReader } from '../application/ports/source-state.reader';
import { ReviewQueueUseCase } from '../application/review-queue.use-case';
import { SyncCatalogUseCase } from '../application/sync-catalog.use-case';
import { VerifyBenefitsUseCase } from '../application/verify-benefits.use-case';
import { JsonBenefitCatalog } from './catalog/json-benefit-catalog';
import { ReviewPrinter } from './cli/review-printer';
import { BenefitsController } from './http/benefits.controller';
import { PrismaBenefitRepository } from './persistence/prisma-benefit.repository';
import { PrismaSourceStateReader } from './persistence/prisma-source-state.reader';

// pnpm 스크립트와 Docker 모두 apps/api 폴더에서 실행된다
const CATALOG_PATH = join(process.cwd(), 'data/benefit-catalog.json');

const withRepositoryAndReader = [BenefitRepository, SourceStateReader];

@Module({
  controllers: [BenefitsController],
  providers: [
    { provide: BenefitRepository, useClass: PrismaBenefitRepository },
    { provide: SourceStateReader, useClass: PrismaSourceStateReader },
    { provide: BenefitCatalog, useFactory: () => new JsonBenefitCatalog(CATALOG_PATH) },
    {
      provide: SyncCatalogUseCase,
      useFactory: (catalog: BenefitCatalog, repository: BenefitRepository) => new SyncCatalogUseCase(catalog, repository),
      inject: [BenefitCatalog, BenefitRepository],
    },
    {
      provide: ReviewQueueUseCase,
      useFactory: (repository: BenefitRepository, reader: SourceStateReader) => new ReviewQueueUseCase(repository, reader),
      inject: withRepositoryAndReader,
    },
    {
      provide: VerifyBenefitsUseCase,
      useFactory: (repository: BenefitRepository, reader: SourceStateReader) => new VerifyBenefitsUseCase(repository, reader),
      inject: withRepositoryAndReader,
    },
    {
      provide: ListPublishedBenefitsUseCase,
      useFactory: (repository: BenefitRepository, reader: SourceStateReader) => new ListPublishedBenefitsUseCase(repository, reader),
      inject: withRepositoryAndReader,
    },
    { provide: ReviewPrinter, useFactory: () => new ReviewPrinter() },
  ],
  exports: [SyncCatalogUseCase, ReviewQueueUseCase, VerifyBenefitsUseCase, ReviewPrinter],
})
export class BenefitModule {}
