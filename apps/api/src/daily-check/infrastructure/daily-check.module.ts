import { Module } from '@nestjs/common';
import { ReviewQueueUseCase } from '../../benefit/application/review-queue.use-case';
import { BenefitModule } from '../../benefit/infrastructure/benefit.module';
import { CollectAllSourcesUseCase } from '../../collect/application/collect-all-sources.use-case';
import { ReportPrinter } from '../../collect/infrastructure/cli/report-printer';
import { CollectModule } from '../../collect/infrastructure/collect.module';
import { DailyCheckUseCase } from '../application/daily-check.use-case';
import { DailyCheckPrinter } from './daily-check-printer';
import { DailyCheckScheduler } from './daily-check.scheduler';

@Module({
  imports: [CollectModule, BenefitModule],
  providers: [
    {
      provide: DailyCheckUseCase,
      useFactory: (collectAll: CollectAllSourcesUseCase, reviewQueue: ReviewQueueUseCase) => new DailyCheckUseCase(collectAll, reviewQueue),
      inject: [CollectAllSourcesUseCase, ReviewQueueUseCase],
    },
    {
      provide: DailyCheckPrinter,
      useFactory: (reportPrinter: ReportPrinter) => new DailyCheckPrinter(reportPrinter),
      inject: [ReportPrinter],
    },
    DailyCheckScheduler,
  ],
  exports: [DailyCheckUseCase, DailyCheckPrinter],
})
export class DailyCheckModule {}
