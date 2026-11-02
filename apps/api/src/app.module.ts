import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BenefitModule } from './benefit/infrastructure/benefit.module';
import { DailyCheckModule } from './daily-check/infrastructure/daily-check.module';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, BenefitModule, DailyCheckModule],
  controllers: [HealthController],
})
export class AppModule {}
