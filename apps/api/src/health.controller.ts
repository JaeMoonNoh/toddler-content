import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

// 서버와 DB 연결 상태를 함께 확인한다
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    let db = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      db = 'error';
    }
    return { status: 'ok', db, time: new Date().toISOString() };
  }
}
