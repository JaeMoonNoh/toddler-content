import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { AccountRepository, type AccountSummary } from '../../application/ports/account-repository';

import type { SocialIdentity } from '../../domain/social-identity';

const UNIQUE_VIOLATION = 'P2002';

@Injectable()
export class PrismaAccountRepository extends AccountRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findOrCreateUser(identity: SocialIdentity): Promise<string> {
    const existing = await this.userIdOf(identity);
    if (existing) return existing;
    try {
      const user = await this.prisma.user.create({ data: { accounts: { create: identity } }, select: { id: true } });
      return user.id;
    } catch (error) {
      // 같은 사람이 두 창에서 동시에 처음 로그인하면 한쪽이 먼저 만든다. 그 계정을 쓴다
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === UNIQUE_VIOLATION) {
        const created = await this.userIdOf(identity);
        if (created) return created;
      }
      throw error;
    }
  }

  async summaryOf(userId: string): Promise<AccountSummary | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true, accounts: { select: { provider: true } } },
    });
    return user ? { providers: user.accounts.map((account) => account.provider), joinedAt: user.createdAt } : null;
  }

  // 로그인 수단, 세션, 저장한 조건, 저장한 혜택은 외래키 Cascade로 함께 지워진다
  async deleteUser(userId: string): Promise<void> {
    await this.prisma.user.deleteMany({ where: { id: userId } });
  }

  private async userIdOf({ provider, providerUserId }: SocialIdentity): Promise<null | string> {
    const account = await this.prisma.socialAccount.findUnique({
      where: { provider_providerUserId: { provider, providerUserId } },
      select: { userId: true },
    });
    return account?.userId ?? null;
  }
}
