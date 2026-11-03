import { describe, expect, it } from 'vitest';
import { ServiceKey } from '../sources/service-key';

const keyIn = (url: URL) => url.searchParams.get('serviceKey');

describe('ServiceKey', () => {
  it('키를 주소에 붙인다', () => {
    expect(keyIn(new ServiceKey('abc').signed(new URL('https://a.kr/x?page=1')))).toBe('abc');
  });

  it('원래 주소는 바꾸지 않는다', () => {
    const original = new URL('https://a.kr/x');
    new ServiceKey('abc').signed(original);
    expect(original.searchParams.has('serviceKey')).toBe(false);
  });

  it('+, /, = 같은 문자가 든 키도 한 번만 인코딩된다', () => {
    const signed = new ServiceKey('a+b/c==').signed(new URL('https://a.kr/x'));
    expect(keyIn(signed)).toBe('a+b/c==');
    expect(signed.toString()).toContain('serviceKey=a%2Bb%2Fc%3D%3D');
  });
});
