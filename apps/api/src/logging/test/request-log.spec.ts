import { describe, expect, it } from 'vitest';

import { toRequestLogLine } from '../request-log';

const request = (url: string, status = 200, durationMs = 12.4) => ({ method: 'GET', url, status, durationMs });

describe('toRequestLogLine', () => {
  it('메서드, 경로, 상태 코드, 걸린 시간을 한 줄로 쓴다', () => {
    expect(toRequestLogLine(request('/benefits'))).toEqual({ level: 'log', message: 'GET /benefits 200 12ms' });
  });

  it('쿼리는 남기지 않는다', () => {
    expect(toRequestLogLine(request('/benefits?dueDate=2027-03-01'))?.message).toBe('GET /benefits 200 12ms');
  });

  it('4xx는 warn, 5xx는 error로 남긴다', () => {
    expect(toRequestLogLine(request('/nope', 404))?.level).toBe('warn');
    expect(toRequestLogLine(request('/benefits', 499))?.level).toBe('warn');
    expect(toRequestLogLine(request('/benefits', 500))?.level).toBe('error');
  });

  it('3xx까지는 일반 로그로 남긴다', () => {
    expect(toRequestLogLine(request('/benefits', 304))?.level).toBe('log');
  });

  it('헬스 체크는 남기지 않는다 (쿼리가 붙어도)', () => {
    expect(toRequestLogLine(request('/health'))).toBeNull();
    expect(toRequestLogLine(request('/health?probe=1'))).toBeNull();
  });

  it('헬스 체크는 상태 코드와 관계없이 남기지 않는다 (DB 오류는 헬스 체크가 따로 남긴다)', () => {
    expect(toRequestLogLine(request('/health', 503))).toBeNull();
  });

  it('주소가 비어 있으면 /로 쓴다', () => {
    expect(toRequestLogLine(request(''))?.message).toBe('GET / 200 12ms');
  });

  it('걸린 시간은 반올림한다', () => {
    expect(toRequestLogLine(request('/benefits', 200, 0.4))?.message).toBe('GET /benefits 200 0ms');
  });
});
