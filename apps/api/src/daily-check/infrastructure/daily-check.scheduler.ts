import { BeforeApplicationShutdown, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';

import { CollectionAlreadyRunningError } from '../../collect/application/collect.service';
import { DailyCheckService, requiresAttention } from '../application/daily-check.service';

import { DailyCheckPrinter } from './daily-check-printer';

const DAILY_CHECK_JOB = 'daily-check';

// 공공 API 이용이 적은 새벽에 하루 한 번 수집하고, 확인할 혜택이 생겼는지 함께 본다
@Injectable()
export class DailyCheckScheduler implements OnApplicationBootstrap, BeforeApplicationShutdown {
  private readonly logger = new Logger(DailyCheckScheduler.name);
  private inProgress: Promise<void> | null = null;

  constructor(
    private readonly dailyCheck: DailyCheckService,
    private readonly printer: DailyCheckPrinter,
    private readonly config: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async onApplicationBootstrap() {
    if (this.config.getOrThrow<string>('COLLECT_SCHEDULE') !== 'off') return;
    await this.schedulerRegistry.getCronJob(DAILY_CHECK_JOB).stop();
    this.logger.log('COLLECT_SCHEDULE=off: 새벽 자동 수집을 끕니다.');
  }

  // 수집 도중에 서버가 꺼지면 끝날 때까지 기다린다. 기다리는 동안 DB 연결은 열려 있다
  async beforeApplicationShutdown() {
    if (!this.inProgress) return;
    this.logger.warn('진행 중인 수집이 끝나면 종료합니다.');
    await this.inProgress;
  }

  @Cron('0 4 * * *', { name: DAILY_CHECK_JOB, timeZone: 'Asia/Seoul' })
  async runDaily() {
    if (this.inProgress) return this.logger.warn('이전 수집이 아직 진행 중이라 이번 수집은 건너뜁니다.');
    this.inProgress = this.check();
    try {
      await this.inProgress;
    } finally {
      this.inProgress = null;
    }
  }

  private async check() {
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
