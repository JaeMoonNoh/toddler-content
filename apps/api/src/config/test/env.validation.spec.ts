import { describe, expect, it } from 'vitest';
import { validateEnv } from '../env.validation';

const required = { DATABASE_URL: 'postgres://localhost/toddler', DATA_GO_KR_SERVICE_KEY: 'KEY' };
const failureOf = (config: Record<string, unknown>) => {
  try {
    validateEnv(config);
  } catch (error) {
    return (error as Error).message;
  }
  throw new Error('실패해야 하는데 성공함');
};

describe('validateEnv', () => {
  it('필수 값만 있으면 나머지는 기본값을 쓴다', () => {
    expect(validateEnv(required)).toMatchObject({ PORT: 4000, WEB_ORIGIN: 'http://localhost:3000', COLLECT_SCHEDULE: 'on' });
  });

  it('PORT는 숫자로 바꾼다', () => {
    expect(validateEnv({ ...required, PORT: '4100' }).PORT).toBe(4100);
  });

  it('인증키의 앞뒤 공백과 따옴표를 벗긴다', () => {
    expect(validateEnv({ ...required, DATA_GO_KR_SERVICE_KEY: ' "a+b/c==" ' }).DATA_GO_KR_SERVICE_KEY).toBe('a+b/c==');
  });

  it.each([
    ['인증키 없음', { DATABASE_URL: 'postgres://x' }, 'DATA_GO_KR_SERVICE_KEY'],
    ['인증키가 따옴표뿐', { ...required, DATA_GO_KR_SERVICE_KEY: '""' }, 'DATA_GO_KR_SERVICE_KEY'],
    ['DB 주소 없음', { DATA_GO_KR_SERVICE_KEY: 'KEY' }, 'DATABASE_URL'],
    ['PORT가 숫자 아님', { ...required, PORT: 'abc' }, 'PORT'],
    ['PORT 범위 밖', { ...required, PORT: '70000' }, 'PORT'],
    ['COLLECT_SCHEDULE이 on/off 아님', { ...required, COLLECT_SCHEDULE: 'false' }, 'COLLECT_SCHEDULE'],
    ['WEB_ORIGIN이 주소 아님', { ...required, WEB_ORIGIN: 'localhost' }, 'WEB_ORIGIN'],
  ])('%s이면 시작하지 않는다', (_, config, field) => {
    expect(failureOf(config)).toContain(field);
  });

  it('문제가 여러 개면 한 번에 알려준다', () => {
    const message = failureOf({});
    expect(message).toContain('DATABASE_URL');
    expect(message).toContain('DATA_GO_KR_SERVICE_KEY');
  });
});
