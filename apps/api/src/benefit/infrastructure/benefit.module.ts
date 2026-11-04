import { join } from 'node:path';

import { Module } from '@nestjs/common';

import { CollectModule } from '../../collect/infrastructure/collect.module';
import { RegionModule } from '../../region/infrastructure/region.module';
import { BenefitCandidateService } from '../application/benefit-candidate.service';
import { BenefitCatalogService } from '../application/benefit-catalog.service';
import { BenefitPlanService } from '../application/benefit-plan.service';
import { BenefitReviewService } from '../application/benefit-review.service';
import { BenefitCatalog } from '../application/ports/benefit-catalog';
import { BenefitRepository } from '../application/ports/benefit.repository';
import { SourceStateReader } from '../application/ports/source-state.reader';
import { PublishedBenefitService } from '../application/published-benefit.service';

import { JsonBenefitCatalog } from './catalog/json-benefit-catalog';
import { BenefitDetailPrinter } from './cli/benefit-detail-printer';
import { ReviewPrinter } from './cli/review-printer';
import { BenefitsController } from './http/benefits.controller';
import { PrismaBenefitRepository } from './persistence/prisma-benefit.repository';
import { PrismaSourceStateReader } from './persistence/prisma-source-state.reader';

// pnpm 스크립트와 Docker 모두 apps/api 폴더에서 실행된다
const CATALOG_PATH = join(process.cwd(), 'data/benefit-catalog.json');

@Module({
  imports: [RegionModule, CollectModule],
  controllers: [BenefitsController],
  providers: [
    BenefitCatalogService,
    BenefitCandidateService,
    BenefitPlanService,
    BenefitReviewService,
    PublishedBenefitService,
    { provide: BenefitRepository, useClass: PrismaBenefitRepository },
    { provide: SourceStateReader, useClass: PrismaSourceStateReader },
    { provide: BenefitCatalog, useFactory: () => new JsonBenefitCatalog(CATALOG_PATH) },
    ReviewPrinter,
    { provide: BenefitDetailPrinter, useFactory: () => new BenefitDetailPrinter() },
  ],
  exports: [BenefitCatalogService, BenefitCandidateService, BenefitPlanService, BenefitReviewService, ReviewPrinter, BenefitDetailPrinter],
})
export class BenefitModule {}
