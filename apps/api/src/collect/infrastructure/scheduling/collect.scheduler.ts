import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CollectAllSourcesUseCase, CollectionAlreadyRunningError } from '../../application/collect-all-sources.use-case';
import { ReportPrinter } from '../cli/report-printer';

// 공공 API 이용이 적은 새벽에 하루 한 번 전체를 수집한다
@Injectable()
export class CollectScheduler {
  private readonly logger = new Logger(CollectScheduler.name);

  constructor(
    private readonly collectAll: CollectAllSourcesUseCase,
    private readonly printer: ReportPrinter,
  ) {}

  @Cron('0 4 * * *', { name: 'daily-collect', timeZone: 'Asia/Seoul', disabled: process.env.COLLECT_SCHEDULE === 'off' })
  async collectDaily() {
    try {
      const report = await this.collectAll.execute();
      const text = this.printer.print(report, new Date());
      if (report.hasFailures) this.logger.warn(text);
      else this.logger.log(text);
    } catch (error) {
      if (error instanceof CollectionAlreadyRunningError) this.logger.warn(error.message);
      else this.logger.error(error);
    }
  }
}
