import { OAuthLoginError, OAuthProvider } from '../../ports/oauth-provider';

import type { SocialIdentity, SocialProvider } from '../../../domain/social-identity';

// code를 그대로 그 사람의 ID로 본다. 'bad'는 로그인 실패
export class FakeOAuthProvider extends OAuthProvider {
  constructor(readonly provider: SocialProvider = 'KAKAO') {
    super();
  }

  authorizeUrl(state: string): string {
    return `https://login.example/${this.provider}?state=${state}`;
  }

  async identityOf(code: string): Promise<SocialIdentity> {
    if (code === 'bad') throw new OAuthLoginError('로그인 실패');
    return { provider: this.provider, providerUserId: code };
  }
}
