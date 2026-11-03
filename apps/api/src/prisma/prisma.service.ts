import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnApplicationShutdown {
  private readonly logger = new Logger(PrismaService.name);

  constructor(config: ConfigService) {
    super({ adapter: new PrismaPg({ connectionString: config.getOrThrow<string>('DATABASE_URL') }) });
  }

  // onModuleDestroy는 beforeApplicationShutdown보다 먼저 불려서, 종료를 기다리는 작업이 DB를 못 쓰게 된다.
  // 그래서 종료 단계의 맨 마지막에 닫는다
  async onApplicationShutdown() {
    await this.$disconnect();
    this.logger.log('Database connection closed');
  }
}
