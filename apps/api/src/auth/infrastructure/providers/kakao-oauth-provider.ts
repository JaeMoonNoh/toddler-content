import { OAuthLoginError, OAuthProvider } from '../../application/ports/oauth-provider';

import type { SocialIdentity } from '../../domain/social-identity';

export type FormFetch = (url: string, init: RequestInit) => Promise<Response>;

export interface KakaoSettings {
  restApiKey: string;
  clientSecret: null | string; // 카카오 개발자 콘솔에서 Client Secret을 켰을 때만
  redirectUri: string;
}

const AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize';
const TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
const USER_URL = 'https://kapi.kakao.com/v2/user/me';
const TIMEOUT_MS = 10_000;

// 카카오 로그인 (REST API). 동의 항목은 요청하지 않고 회원번호(id)만 쓴다
export class KakaoOAuthProvider extends OAuthProvider {
  readonly provider = 'KAKAO' as const;

  constructor(
    private readonly settings: KakaoSettings,
    private readonly send: FormFetch = fetch,
  ) {
    super();
  }

  authorizeUrl(state: string): string {
    const url = new URL(AUTHORIZE_URL);
    url.search = new URLSearchParams({
      client_id: this.settings.restApiKey,
      redirect_uri: this.settings.redirectUri,
      response_type: 'code',
      state,
    }).toString();
    return url.toString();
  }

  async identityOf(code: string): Promise<SocialIdentity> {
    const accessToken = await this.accessTokenOf(code);
    const user = await this.requestJson('사용자 조회', USER_URL, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (typeof user.id !== 'number' && typeof user.id !== 'string') throw new OAuthLoginError('카카오 사용자 조회: 회원번호가 없습니다');
    return { provider: this.provider, providerUserId: String(user.id) };
  }

  private async accessTokenOf(code: string): Promise<string> {
    const form = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.settings.restApiKey,
      redirect_uri: this.settings.redirectUri,
      code,
    });
    if (this.settings.clientSecret) form.set('client_secret', this.settings.clientSecret);
    const body = await this.requestJson('토큰 발급', TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      body: form.toString(),
    });
    if (typeof body.access_token !== 'string') throw new OAuthLoginError('카카오 토큰 발급: access_token이 없습니다');
    return body.access_token;
  }

  // 오류 메시지에는 카카오가 준 오류 코드만 남긴다 (code, 토큰, 키는 넣지 않는다)
  private async requestJson(step: string, url: string, init: RequestInit): Promise<Record<string, unknown>> {
    let response: Response;
    try {
      response = await this.send(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
    } catch (error) {
      const reason = error instanceof Error && error.name === 'TimeoutError' ? `${TIMEOUT_MS}ms 안에 응답 없음` : '네트워크 오류';
      throw new OAuthLoginError(`카카오 ${step}: ${reason}`);
    }
    const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    if (!response.ok) throw new OAuthLoginError(`카카오 ${step}: HTTP ${response.status} ${errorCodeOf(body)}`.trim());
    return body;
  }
}

function errorCodeOf(body: Record<string, unknown>): string {
  return [body.error, body.error_code, body.code].filter((value) => typeof value === 'string' || typeof value === 'number').join(' ');
}
