import { createHash, randomBytes } from 'node:crypto';

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../prisma/prisma.service';
import { SessionStore } from '../../application/ports/session-store';

const TOKEN_BYTES = 32;

// 토큰은 해시로만 저장한다. DB 내용이 새도 그것으로 로그인할 수 없다
@Injectable()
export class PrismaSessionStore extends SessionStore {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(userId: string, expiresAt: Date): Promise<string> {
    const token = randomBytes(TOKEN_BYTES).toString('base64url');
    await this.prisma.session.create({ data: { tokenHash: hashOf(token), userId, expiresAt } });
    return token;
  }

  async userIdOf(token: string, now: Date): Promise<null | string> {
    const session = await this.prisma.session.findFirst({
      where: { tokenHash: hashOf(token), expiresAt: { gt: now } },
      select: { userId: true },
    });
    return session?.userId ?? null;
  }

  async delete(token: string): Promise<void> {
    await this.prisma.session.deleteMany({ where: { tokenHash: hashOf(token) } });
  }

  async deleteAllOf(userId: string): Promise<void> {
    await this.prisma.session.deleteMany({ where: { userId } });
  }
}

function hashOf(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
