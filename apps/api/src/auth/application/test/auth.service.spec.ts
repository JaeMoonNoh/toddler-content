import { describe, expect, it } from 'vitest';

import { AuthService, UnavailableProviderError } from '../auth.service';
import { OAuthProviders } from '../oauth-providers';
import { OAuthLoginError } from '../ports/oauth-provider';

import { FakeOAuthProvider } from './fakes/fake-oauth-provider';
import { InMemoryAccountRepository } from './fakes/in-memory-account-repository';
import { InMemorySessionStore } from './fakes/in-memory-session-store';

const now = new Date('2026-11-05T00:00:00Z');

function setup(providers = [new FakeOAuthProvider()]) {
  const accounts = new InMemoryAccountRepository();
  const sessions = new InMemorySessionStore();
  return { accounts, sessions, auth: new AuthService(new OAuthProviders(providers), accounts, sessions) };
}

describe('AuthService', () => {
  it('처음 로그인하면 계정을 만들고 30일짜리 세션을 연다', async () => {
    const { auth, accounts } = setup();
    const session = await auth.finishLogin('KAKAO', '123', now);

    expect(session.expiresAt.toISOString()).toBe('2026-12-05T00:00:00.000Z');
    expect(await auth.userIdOf(session.token, now)).toBe('user-1');
    expect(accounts.users.size).toBe(1);
  });

  it('같은 사람이 다시 로그인하면 같은 계정에 새 세션을 연다', async () => {
    const { auth, accounts } = setup();
    const first = await auth.finishLogin('KAKAO', '123', now);
    const second = await auth.finishLogin('KAKAO', '123', now);

    expect(second.token).not.toBe(first.token);
    expect(await auth.userIdOf(second.token, now)).toBe('user-1');
    expect(accounts.users.size).toBe(1);
  });

  it('다른 수단의 같은 ID는 다른 계정이다 (자동으로 합치지 않는다)', async () => {
    const { auth } = setup([new FakeOAuthProvider('KAKAO'), new FakeOAuthProvider('NAVER' as never)]);
    const kakao = await auth.finishLogin('KAKAO', '123', now);
    const naver = await auth.finishLogin('NAVER' as never, '123', now);

    expect([await auth.userIdOf(kakao.token, now), await auth.userIdOf(naver.token, now)]).toEqual(['user-1', 'user-2']);
  });

  it('경계: 만료 시각이 되면 로그인이 풀린다', async () => {
    const { auth } = setup();
    const { token, expiresAt } = await auth.finishLogin('KAKAO', '123', now);

    expect(await auth.userIdOf(token, new Date(expiresAt.getTime() - 1))).toBe('user-1');
    expect(await auth.userIdOf(token, expiresAt)).toBeNull();
  });

  it('로그아웃하면 그 세션만 닫는다', async () => {
    const { auth } = setup();
    const phone = await auth.finishLogin('KAKAO', '123', now);
    const laptop = await auth.finishLogin('KAKAO', '123', now);
    await auth.logout(phone.token);

    expect([await auth.userIdOf(phone.token, now), await auth.userIdOf(laptop.token, now)]).toEqual([null, 'user-1']);
  });

  it('모르는 토큰은 로그인 안 된 것으로 본다', async () => {
    expect(await setup().auth.userIdOf('nope', now)).toBeNull();
  });

  it('로그인 수단이 실패하면 계정도 세션도 만들지 않는다', async () => {
    const { auth, accounts, sessions } = setup();
    await expect(auth.finishLogin('KAKAO', 'bad', now)).rejects.toThrow(OAuthLoginError);
    expect([accounts.users.size, sessions.sessions.size]).toEqual([0, 0]);
  });

  it('설정되지 않은 수단은 로그인 주소도 로그인도 거절한다', async () => {
    const { auth } = setup([]);
    expect(auth.availableProviders()).toEqual([]);
    expect(() => auth.loginUrl('KAKAO', 's')).toThrow(UnavailableProviderError);
    await expect(auth.finishLogin('KAKAO', '123', now)).rejects.toThrow(UnavailableProviderError);
  });

  it('계정 정보: 이어 둔 로그인 수단과 가입일', async () => {
    const { auth } = setup();
    const { token } = await auth.finishLogin('KAKAO', '123', now);
    const userId = (await auth.userIdOf(token, now))!;
    expect(await auth.accountOf(userId)).toEqual({ providers: ['KAKAO'], joinedAt: expect.any(Date) as Date });
    expect(await auth.accountOf('nobody')).toBeNull();
  });

  it('탈퇴하면 모든 기기의 로그인이 풀리고, 다시 로그인하면 새 계정이 된다', async () => {
    const { auth, accounts } = setup();
    const phone = await auth.finishLogin('KAKAO', '123', now);
    const laptop = await auth.finishLogin('KAKAO', '123', now);
    await auth.withdraw('user-1');

    expect([await auth.userIdOf(phone.token, now), await auth.userIdOf(laptop.token, now)]).toEqual([null, null]);
    expect(accounts.deleted).toEqual(['user-1']);
    const again = await auth.finishLogin('KAKAO', '123', now);
    expect(await auth.userIdOf(again.token, now)).toBe('user-2');
  });

  it('탈퇴해도 다른 사람의 로그인은 그대로', async () => {
    const { auth } = setup();
    await auth.finishLogin('KAKAO', '1', now);
    const other = await auth.finishLogin('KAKAO', '2', now);
    await auth.withdraw('user-1');
    expect(await auth.userIdOf(other.token, now)).toBe('user-2');
  });

  it('로그인 주소에 state를 넣는다', () => {
    expect(setup().auth.loginUrl('KAKAO', 'abc')).toBe('https://login.example/KAKAO?state=abc');
  });
});
