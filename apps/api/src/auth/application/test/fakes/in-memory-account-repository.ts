import { AccountRepository } from '../../ports/account-repository';

import type { SocialIdentity } from '../../../domain/social-identity';

export class InMemoryAccountRepository extends AccountRepository {
  readonly users = new Map<string, string>(); // "KAKAO:123" → userId

  async findOrCreateUser({ provider, providerUserId }: SocialIdentity): Promise<string> {
    const key = `${provider}:${providerUserId}`;
    const existing = this.users.get(key);
    if (existing) return existing;
    const userId = `user-${this.users.size + 1}`;
    this.users.set(key, userId);
    return userId;
  }
}
