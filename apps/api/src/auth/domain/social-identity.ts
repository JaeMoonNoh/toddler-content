// 로그인할 수 있는 수단. 새 수단을 붙일 때는 여기에 이름을 더하고 OAuthProvider 구현을 하나 만든다
export const SOCIAL_PROVIDERS = ['KAKAO'] as const;

export type SocialProvider = (typeof SOCIAL_PROVIDERS)[number];

// 로그인 수단이 알려준 "이 사람". 이름·이메일 같은 개인 정보는 받지 않고 수단 안의 ID만 쓴다
export interface SocialIdentity {
  provider: SocialProvider;
  providerUserId: string;
}

// 주소에는 소문자로 쓴다 (/auth/kakao/login)
export function providerOf(slug: string): SocialProvider | null {
  return SOCIAL_PROVIDERS.find((provider) => provider.toLowerCase() === slug) ?? null;
}

export function slugOf(provider: SocialProvider): string {
  return provider.toLowerCase();
}
