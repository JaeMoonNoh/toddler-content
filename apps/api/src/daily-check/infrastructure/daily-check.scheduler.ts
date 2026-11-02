import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CollectionAlreadyRunningError } from '../../collect/application/collect-all-sources.use-case';
import { DailyCheckUseCase, requiresAttention } from '../application/daily-check.use-case';
import { DailyCheckPrinter } from './daily-check-printer';

// 공공 API 이용이 적은 새벽에 하루 한 번 수집하고, 확인할 혜택이 생겼는지 함께 본다
@Injectable()
export class DailyCheckScheduler {
  private readonly logger = new Logger(DailyCheckScheduler.name);

  constructor(
    private readonly dailyCheck: DailyCheckUseCase,
    private readonly printer: DailyCheckPrinter,
  ) {}

  @Cron('0 4 * * *', { name: 'daily-check', timeZone: 'Asia/Seoul', disabled: process.env.COLLECT_SCHEDULE === 'off' })
  async runDaily() {
    try {
      const result = await this.dailyCheck.execute();
      const text = this.printer.print(result, new Date());
      if (requiresAttention(result)) this.logger.warn(text);
      else this.logger.log(text);
    } catch (error) {
      if (error instanceof CollectionAlreadyRunningError) this.logger.warn(error.message);
      else this.logger.error(error);
    }
  }
}
