import { Module } from '@nestjs/common';

import { BenefitModule } from '../../benefit/infrastructure/benefit.module';
import { ReportPrinter } from '../../collect/infrastructure/cli/report-printer';
import { CollectModule } from '../../collect/infrastructure/collect.module';
import { DailyCheckService } from '../application/daily-check.service';

import { DailyCheckPrinter } from './daily-check-printer';

@Module({
  imports: [CollectModule, BenefitModule],
  providers: [
    DailyCheckService,
    {
      provide: DailyCheckPrinter,
      useFactory: (reportPrinter: ReportPrinter) => new DailyCheckPrinter(reportPrinter),
      inject: [ReportPrinter],
    },
  ],
  exports: [DailyCheckService, DailyCheckPrinter],
})
export class DailyCheckModule {}
