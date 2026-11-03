import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppConfigModule } from './config/app-config.module';
import { BenefitModule } from './benefit/infrastructure/benefit.module';
import { DailyCheckScheduleModule } from './daily-check/infrastructure/daily-check-schedule.module';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AppConfigModule, ScheduleModule.forRoot(), PrismaModule, BenefitModule, DailyCheckScheduleModule],
  controllers: [HealthController],
})
export class AppModule {}
