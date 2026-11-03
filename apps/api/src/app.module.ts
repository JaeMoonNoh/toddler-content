import { BeforeApplicationShutdown, Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { BenefitModule } from './benefit/infrastructure/benefit.module';
import { AppConfigModule } from './config/app-config.module';
import { DailyCheckScheduleModule } from './daily-check/infrastructure/daily-check-schedule.module';
import { HealthController } from './health.controller';
import { RequestLoggingMiddleware } from './logging/request-logging.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { RegionModule } from './region/infrastructure/region.module';

@Module({
  imports: [AppConfigModule, ScheduleModule.forRoot(), PrismaModule, BenefitModule, RegionModule, DailyCheckScheduleModule],
  controllers: [HealthController],
})
export class AppModule implements NestModule, BeforeApplicationShutdown {
  private readonly logger = new Logger('Shutdown');

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }

  beforeApplicationShutdown(signal?: string) {
    this.logger.log(`Shutting down (signal=${signal ?? 'none'})`);
  }
}
