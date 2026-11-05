import { describe, expect, it } from 'vitest';

import { AuthCookies, cookieOf } from '../http/auth-cookies';

describe('AuthCookies', () => {
  it('세션 쿠키는 자바스크립트가 못 읽고 만료일이 있다', () => {
    expect(new AuthCookies(false).session('tok', new Date('2026-12-05T00:00:00Z'))).toBe(
      'toddler_session=tok; Path=/; Expires=Sat, 05 Dec 2026 00:00:00 GMT; HttpOnly; SameSite=Lax',
    );
  });

  it('https 주소에서는 Secure를 붙인다', () => {
    expect(new AuthCookies(true).clearSession()).toBe('toddler_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure');
  });

  it('state 쿠키는 10분 동안만 산다', () => {
    expect(new AuthCookies(false).state('s')).toContain('toddler_oauth_state=s; Path=/; Max-Age=600');
  });
});

describe('cookieOf', () => {
  it.each([
    ['a=1; toddler_session=tok; b=2', 'tok'],
    ['toddler_session=a=b', 'a=b'],
    ['toddler_session=', null],
    ['other=1', null],
    [undefined, null],
  ])('%s → %s', (header, value) => {
    expect(cookieOf(header, 'toddler_session')).toBe(value);
  });
});
