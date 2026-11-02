import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// 어느 모듈에서든 PrismaService를 주입받을 수 있게 전역 모듈로 둔다
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
