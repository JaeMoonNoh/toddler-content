import { Injectable } from '@nestjs/common';

import { OAuthProviders } from './oauth-providers';
import { AccountRepository, type AccountSummary } from './ports/account-repository';
import { SessionStore } from './ports/session-store';

import type { SocialProvider } from '../domain/social-identity';

export class UnavailableProviderError extends Error {}

export interface LoginSession {
  token: string;
  expiresAt: Date;
}

const SESSION_DAYS = 30;
const DAY_MS = 86_400_000;

@Injectable()
export class AuthService {
  constructor(
    private readonly providers: OAuthProviders,
    private readonly accounts: AccountRepository,
    private readonly sessions: SessionStore,
  ) {}

  availableProviders(): SocialProvider[] {
    return this.providers.available();
  }

  loginUrl(provider: SocialProvider, state: string): string {
    return this.providerOf(provider).authorizeUrl(state);
  }

  async finishLogin(provider: SocialProvider, code: string, now: Date): Promise<LoginSession> {
    const identity = await this.providerOf(provider).identityOf(code);
    const userId = await this.accounts.findOrCreateUser(identity);
    const expiresAt = new Date(now.getTime() + SESSION_DAYS * DAY_MS);
    return { token: await this.sessions.create(userId, expiresAt), expiresAt };
  }

  userIdOf(token: string, now: Date): Promise<null | string> {
    return this.sessions.userIdOf(token, now);
  }

  logout(token: string): Promise<void> {
    return this.sessions.delete(token);
  }

  accountOf(userId: string): Promise<AccountSummary | null> {
    return this.accounts.summaryOf(userId);
  }

  // 탈퇴: 되돌릴 수 없다. 다시 로그인하면 새 계정이 된다
  async withdraw(userId: string): Promise<void> {
    await this.sessions.deleteAllOf(userId);
    await this.accounts.deleteUser(userId);
  }

  private providerOf(provider: SocialProvider) {
    const found = this.providers.find(provider);
    if (!found) throw new UnavailableProviderError(`${provider} 로그인은 설정되지 않았습니다`);
    return found;
  }
}
