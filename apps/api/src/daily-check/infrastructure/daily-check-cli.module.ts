import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { DailyCheckModule } from './daily-check.module';

// CLI는 HTTP 서버와 스케줄 없이 띄운다 (ScheduleModule을 넣지 않아서 cron은 돌지 않는다)
@Module({
  imports: [PrismaModule, DailyCheckModule],
})
export class DailyCheckCliModule {}
