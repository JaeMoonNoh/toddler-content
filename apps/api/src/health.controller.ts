import { Controller, Get, Logger } from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';

// 서버와 DB 연결 상태를 함께 확인한다
@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    let db = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      db = 'error';
      this.logger.warn(`Health check: database unreachable (${reasonOf(error)})`);
    }
    return { status: 'ok', db, time: new Date().toISOString() };
  }
}

// Prisma 오류는 메시지가 여러 줄이고 정작 원인(ECONNREFUSED, P1001 등)은 code에 있다
function reasonOf(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  const code = (error as { code?: unknown }).code;
  if (typeof code === 'string') return code;
  return error.message.split('\n').find((line) => line.trim()) ?? error.name;
}
