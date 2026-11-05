import { describe, expect, it } from 'vitest';

import { providerOf, slugOf } from '../social-identity';

describe('providerOf', () => {
  it('주소의 소문자 이름으로 로그인 수단을 찾는다', () => {
    expect(providerOf('kakao')).toBe('KAKAO');
    expect(slugOf('KAKAO')).toBe('kakao');
  });

  it.each(['KAKAO', 'naver', '', 'kakao2'])('모르는 이름 "%s"는 null', (slug) => {
    expect(providerOf(slug)).toBeNull();
  });
});
