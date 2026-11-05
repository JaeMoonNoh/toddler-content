export interface LoginState {
  loggedIn: boolean;
  providers: string[]; // 켜 둔 로그인 수단 (kakao 등)
}

const LOGGED_OUT: LoginState = { loggedIn: false, providers: [] };

// 서버가 꺼져 있어도 화면은 그대로 쓸 수 있게, 실패하면 로그인 안 된 것으로 본다
export async function fetchLoginState(): Promise<LoginState> {
  try {
    const [me, providers] = await Promise.all([getJson<{ loggedIn: boolean }>('/api/auth/me'), getJson<{ providers: string[] }>('/api/auth/providers')]);
    return { loggedIn: me.loggedIn, providers: providers.providers };
  } catch {
    return LOGGED_OUT;
  }
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST' });
}

export function loginUrl(provider: string): string {
  return `/api/auth/${provider}/login`;
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`${url} ${response.status}`);
  return (await response.json()) as T;
}
