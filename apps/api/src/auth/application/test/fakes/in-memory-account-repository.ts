import { AccountRepository, type AccountSummary } from '../../ports/account-repository';

import type { SocialIdentity, SocialProvider } from '../../../domain/social-identity';

export class InMemoryAccountRepository extends AccountRepository {
  readonly users = new Map<string, string>(); // "KAKAO:123" → userId
  readonly deleted: string[] = [];
  private created = 0;

  async findOrCreateUser({ provider, providerUserId }: SocialIdentity): Promise<string> {
    const key = `${provider}:${providerUserId}`;
    const existing = this.users.get(key);
    if (existing) return existing;
    const userId = `user-${++this.created}`;
    this.users.set(key, userId);
    return userId;
  }

  async summaryOf(userId: string): Promise<AccountSummary | null> {
    const providers = [...this.users].filter(([, id]) => id === userId).map(([key]) => key.split(':')[0] as SocialProvider);
    return providers.length ? { providers, joinedAt: new Date('2026-11-05T00:00:00Z') } : null;
  }

  async deleteUser(userId: string): Promise<void> {
    for (const [key, id] of this.users) if (id === userId) this.users.delete(key);
    this.deleted.push(userId);
  }
}
