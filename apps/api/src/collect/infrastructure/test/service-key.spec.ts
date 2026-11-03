import { describe, expect, it } from 'vitest';
import { MissingServiceKeyError, ServiceKey } from '../sources/service-key';

const keyIn = (url: URL) => url.searchParams.get('serviceKey');

describe('ServiceKey', () => {
  it('환경변수의 키를 주소에 붙인다', () => {
    const key = ServiceKey.fromEnv({ DATA_GO_KR_SERVICE_KEY: 'abc' })!;
    expect(keyIn(key.signed(new URL('https://a.kr/x?page=1')))).toBe('abc');
  });

  it('원래 주소는 바꾸지 않는다', () => {
    const original = new URL('https://a.kr/x');
    ServiceKey.fromEnv({ DATA_GO_KR_SERVICE_KEY: 'abc' })!.signed(original);
    expect(original.searchParams.has('serviceKey')).toBe(false);
  });

  it('+, /, = 같은 문자가 든 키도 한 번만 인코딩된다', () => {
    const key = ServiceKey.fromEnv({ DATA_GO_KR_SERVICE_KEY: 'a+b/c==' })!;
    const signed = key.signed(new URL('https://a.kr/x'));
    expect(keyIn(signed)).toBe('a+b/c==');
    expect(signed.toString()).toContain('serviceKey=a%2Bb%2Fc%3D%3D');
  });

  it('따옴표와 앞뒤 공백은 지운다', () => {
    const key = ServiceKey.fromEnv({ DATA_GO_KR_SERVICE_KEY: ' "abc" ' })!;
    expect(keyIn(key.signed(new URL('https://a.kr/x')))).toBe('abc');
  });

  it('키가 없거나 비어 있으면 null', () => {
    expect(ServiceKey.fromEnv({})).toBeNull();
    expect(ServiceKey.fromEnv({ DATA_GO_KR_SERVICE_KEY: '   ' })).toBeNull();
    expect(ServiceKey.fromEnv({ DATA_GO_KR_SERVICE_KEY: '""' })).toBeNull();
  });

  it('키가 꼭 필요한 곳에서 없으면 설정 방법을 알려준다', () => {
    expect(() => ServiceKey.required(null)).toThrow(MissingServiceKeyError);
    expect(() => ServiceKey.required(null)).toThrow('apps/api/.env');
  });
});
