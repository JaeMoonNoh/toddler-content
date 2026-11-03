import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CollectionAlreadyRunningError } from '../../collect/application/collect.service';
import { DailyCheckService, requiresAttention } from '../application/daily-check.service';
import { DailyCheckPrinter } from './daily-check-printer';

const DAILY_CHECK_JOB = 'daily-check';

// 공공 API 이용이 적은 새벽에 하루 한 번 수집하고, 확인할 혜택이 생겼는지 함께 본다
@Injectable()
export class DailyCheckScheduler implements OnApplicationBootstrap {
  private readonly logger = new Logger(DailyCheckScheduler.name);

  constructor(
    private readonly dailyCheck: DailyCheckService,
    private readonly printer: DailyCheckPrinter,
    private readonly config: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  onApplicationBootstrap() {
    if (this.config.getOrThrow<string>('COLLECT_SCHEDULE') !== 'off') return;
    this.schedulerRegistry.getCronJob(DAILY_CHECK_JOB).stop();
    this.logger.log('COLLECT_SCHEDULE=off: 새벽 자동 수집을 끕니다.');
  }

  @Cron('0 4 * * *', { name: DAILY_CHECK_JOB, timeZone: 'Asia/Seoul' })
  async runDaily() {
    try {
      const result = await this.dailyCheck.run();
      const text = this.printer.print(result, new Date());
      if (requiresAttention(result)) this.logger.warn(text);
      else this.logger.log(text);
    } catch (error) {
      if (error instanceof CollectionAlreadyRunningError) this.logger.warn(error.message);
      else this.logger.error(error);
    }
  }
}
