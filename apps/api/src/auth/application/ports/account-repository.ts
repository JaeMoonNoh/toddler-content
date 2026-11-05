import type { SocialIdentity, SocialProvider } from '../../domain/social-identity';

export interface AccountSummary {
  providers: SocialProvider[]; // 이어 둔 로그인 수단
  joinedAt: Date;
}

export abstract class AccountRepository {
  // 처음 보는 사람이면 계정을 만들고, 이미 있으면 그 계정 ID를 돌려준다
  abstract findOrCreateUser(identity: SocialIdentity): Promise<string>;

  abstract summaryOf(userId: string): Promise<AccountSummary | null>;

  // 계정과 거기 딸린 것(로그인 수단, 세션, 저장한 조건, 저장한 혜택)을 모두 지운다
  abstract deleteUser(userId: string): Promise<void>;
}
