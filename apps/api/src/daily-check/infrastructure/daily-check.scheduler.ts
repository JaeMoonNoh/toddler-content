import { BeforeApplicationShutdown, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';

import { CollectionAlreadyRunningError } from '../../collect/application/collect.service';
import { DailyCheckService, requiresAttention } from '../application/daily-check.service';

import { DailyCheckPrinter } from './daily-check-printer';

const DAILY_CHECK_JOB = 'daily-check';
const DAILY_CHECK_CRON = '0 4 * * *';
const TIME_ZONE = 'Asia/Seoul';

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
    const job = this.schedulerRegistry.getCronJob(DAILY_CHECK_JOB);
    if (this.config.getOrThrow<string>('COLLECT_SCHEDULE') === 'off') {
      await job.stop();
      this.logger.log('Daily check disabled (COLLECT_SCHEDULE=off)');
      return;
    }
    this.logger.log(`Daily check scheduled: "${DAILY_CHECK_CRON}" ${TIME_ZONE}, next run ${job.nextDate().toISO()}`);
  }

  // 수집 도중에 서버가 꺼지면 끝날 때까지 기다린다. 기다리는 동안 DB 연결은 열려 있다
  async beforeApplicationShutdown() {
    if (!this.inProgress) return;
    this.logger.warn('Waiting for the running daily check to finish before shutdown');
    await this.inProgress;
  }

  @Cron(DAILY_CHECK_CRON, { name: DAILY_CHECK_JOB, timeZone: TIME_ZONE })
  async runDaily() {
    if (this.inProgress) return this.logger.warn('Daily check skipped: previous run is still in progress');
    this.inProgress = this.check();
    try {
      await this.inProgress;
    } finally {
      this.inProgress = null;
    }
  }

  private async check() {
    try {
      this.logger.log('Daily check started');
      const result = await this.dailyCheck.run();
      // 첫 줄은 검색용 요약, 그 아래는 사람이 읽는 보고서
      const text = `${this.printer.summaryLine(result)}\n${this.printer.print(result, new Date())}`;
      if (requiresAttention(result)) this.logger.warn(text);
      else this.logger.log(text);
    } catch (error) {
      if (error instanceof CollectionAlreadyRunningError) this.logger.warn('Daily check skipped: collection is already running (CLI?)');
      else this.logger.error('Daily check crashed', error instanceof Error ? error.stack : String(error));
    }
  }
}
