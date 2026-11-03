import { Module } from '@nestjs/common';

import { AppConfigModule } from '../../config/app-config.module';
import { PrismaModule } from '../../prisma/prisma.module';

import { DailyCheckModule } from './daily-check.module';

// CLI는 HTTP 서버와 스케줄 없이 띄운다
@Module({
  imports: [AppConfigModule, PrismaModule, DailyCheckModule],
})
export class DailyCheckCliModule {}
