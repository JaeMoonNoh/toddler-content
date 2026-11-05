export const SESSION_COOKIE = 'toddler_session';
export const STATE_COOKIE = 'toddler_oauth_state';
const STATE_MAX_AGE_SECONDS = 600; // 로그인 화면에서 10분 안에 돌아와야 한다

// 로그인 쿠키. 자바스크립트에서 읽을 수 없게(HttpOnly) 두고, 카카오에서 돌아오는 이동에도 실리도록 SameSite=Lax로 둔다
export class AuthCookies {
  constructor(private readonly secure: boolean) {}

  session(token: string, expiresAt: Date): string {
    return this.serialize(SESSION_COOKIE, token, `Expires=${expiresAt.toUTCString()}`);
  }

  clearSession(): string {
    return this.serialize(SESSION_COOKIE, '', 'Max-Age=0');
  }

  state(value: string): string {
    return this.serialize(STATE_COOKIE, value, `Max-Age=${STATE_MAX_AGE_SECONDS}`);
  }

  clearState(): string {
    return this.serialize(STATE_COOKIE, '', 'Max-Age=0');
  }

  private serialize(name: string, value: string, lifetime: string): string {
    return [`${name}=${value}`, 'Path=/', lifetime, 'HttpOnly', 'SameSite=Lax', ...(this.secure ? ['Secure'] : [])].join('; ');
  }
}

export function cookieOf(header: string | undefined, name: string): null | string {
  for (const part of (header ?? '').split(';')) {
    const [key, ...value] = part.trim().split('=');
    if (key === name) return value.join('=') || null;
  }
  return null;
}
