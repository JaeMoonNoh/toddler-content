import { Module } from '@nestjs/common';

import { DailyCheckModule } from './daily-check.module';
import { DailyCheckScheduler } from './daily-check.scheduler';

// 서버에서만 쓴다. CLI는 ScheduleModule 없이 뜨므로 스케줄러를 넣으면 SchedulerRegistry를 못 찾는다
@Module({
  imports: [DailyCheckModule],
  providers: [DailyCheckScheduler],
})
export class DailyCheckScheduleModule {}
