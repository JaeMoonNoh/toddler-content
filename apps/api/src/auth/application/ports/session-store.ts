export abstract class SessionStore {
  // 새 로그인 세션을 만들고 쿠키에 넣을 토큰을 돌려준다
  abstract create(userId: string, expiresAt: Date): Promise<string>;

  // 만료되지 않은 세션의 계정 ID. 없거나 만료되면 null
  abstract userIdOf(token: string, now: Date): Promise<null | string>;

  abstract delete(token: string): Promise<void>;
}
