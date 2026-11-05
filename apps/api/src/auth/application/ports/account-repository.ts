import type { SocialIdentity } from '../../domain/social-identity';

export abstract class AccountRepository {
  // 처음 보는 사람이면 계정을 만들고, 이미 있으면 그 계정 ID를 돌려준다
  abstract findOrCreateUser(identity: SocialIdentity): Promise<string>;
}
