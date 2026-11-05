import type { SocialIdentity, SocialProvider } from '../../domain/social-identity';

export class OAuthLoginError extends Error {}

// 카카오, 네이버, 구글처럼 OAuth로 로그인하는 수단 하나
export abstract class OAuthProvider {
  abstract readonly provider: SocialProvider;

  // 로그인 화면 주소. state는 돌아왔을 때 우리가 보낸 요청인지 확인하는 값
  abstract authorizeUrl(state: string): string;

  // 로그인 후 돌려받은 code로 이 사람이 누구인지 묻는다. 실패하면 OAuthLoginError
  abstract identityOf(code: string): Promise<SocialIdentity>;
}
