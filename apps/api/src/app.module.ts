import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BenefitModule } from './benefit/infrastructure/benefit.module';
import { CollectModule } from './collect/infrastructure/collect.module';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, CollectModule, BenefitModule],
  controllers: [HealthController],
})
export class AppModule {}
