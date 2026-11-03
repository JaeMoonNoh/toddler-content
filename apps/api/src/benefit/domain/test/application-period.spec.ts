import { describe, expect, it } from 'vitest';
import { periodProblems, samePeriod, type ApplicationPeriod } from '../application-period';

const period = (overrides: Partial<ApplicationPeriod> = {}): ApplicationPeriod => ({
  start: '2026-06-15',
  end: '2026-12-31',
  basis: { text: '2026. 6. 15.(월) ~ 2026. 12. 31.(목)', url: 'https://plus.gov.kr' },
  ...overrides,
});

describe('periodProblems', () => {
  it('올바른 기간이면 문제없다', () => {
    expect(periodProblems(period())).toEqual([]);
  });

  it('하루짜리 기간도 받는다', () => {
    expect(periodProblems(period({ start: '2026-10-01', end: '2026-10-01' }))).toEqual([]);
  });

  it.each([
    ['점으로 쓴 날짜', { start: '2026.06.15' }, '시작일이 올바른 날짜'],
    ['없는 날짜', { end: '2026-02-30' }, '마감일이 올바른 날짜'],
    ['마감이 시작보다 앞', { start: '2026-12-31', end: '2026-06-15' }, '시작일보다 앞'],
    ['근거 없음', { basis: { text: ' ', url: 'https://a.kr' } }, '근거 문장'],
    ['근거 링크 http', { basis: { text: '근거', url: 'http://a.kr' } }, 'https'],
  ])('%s이면 알려준다', (_, overrides, message) => {
    expect(periodProblems(period(overrides)).join(' ')).toContain(message);
  });

  it('날짜가 잘못됐으면 순서는 따지지 않는다', () => {
    expect(periodProblems(period({ start: 'x', end: '2026-01-01' }))).toHaveLength(1);
  });
});

describe('samePeriod', () => {
  it('내용이 같으면 같고, 하나라도 다르면 다르다', () => {
    expect(samePeriod(period(), period())).toBe(true);
    expect(samePeriod(null, null)).toBe(true);
    expect(samePeriod(period(), period({ end: '2026-12-30' }))).toBe(false);
    expect(samePeriod(period(), null)).toBe(false);
  });
});
