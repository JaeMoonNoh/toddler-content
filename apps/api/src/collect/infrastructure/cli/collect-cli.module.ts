import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../prisma/prisma.module';
import { CollectModule } from '../collect.module';

// CLI는 HTTP 서버와 스케줄 없이 수집 모듈만 띄운다
@Module({
  imports: [PrismaModule, CollectModule],
})
export class CollectCliModule {}
