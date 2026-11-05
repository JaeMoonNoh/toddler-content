import type { SocialProvider } from '../domain/social-identity';

import type { OAuthProvider } from './ports/oauth-provider';

// 설정이 있는 로그인 수단만 모아 둔다. 키가 없는 수단은 화면에 버튼을 띄우지 않는다
export class OAuthProviders {
  constructor(private readonly providers: OAuthProvider[]) {}

  find(provider: SocialProvider): null | OAuthProvider {
    return this.providers.find((candidate) => candidate.provider === provider) ?? null;
  }

  available(): SocialProvider[] {
    return this.providers.map((provider) => provider.provider);
  }
}
