import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppConfigModule } from './config/app-config.module';
import { BenefitModule } from './benefit/infrastructure/benefit.module';
import { DailyCheckModule } from './daily-check/infrastructure/daily-check.module';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AppConfigModule, ScheduleModule.forRoot(), PrismaModule, BenefitModule, DailyCheckModule],
  controllers: [HealthController],
})
export class AppModule {}
