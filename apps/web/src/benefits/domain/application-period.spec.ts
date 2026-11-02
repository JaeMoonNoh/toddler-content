import { describe, expect, it } from 'vitest';
import { periodBadge, periodStatus } from './application-period';
import type { ApplicationPeriod } from './benefit';
import { CalendarDate } from './calendar-date';

const period = (start: string, end: string): ApplicationPeriod => ({ start, end, basis: { text: '근거', url: 'https://a.kr' } });
const on = (text: string) => CalendarDate.parse(text)!;
const energy = period('2026-06-15', '2026-12-31');

describe('periodStatus', () => {
  it.each([
    ['2026-06-14', 'upcoming'],
    ['2026-06-15', 'open'],
    ['2026-12-31', 'open'],
    ['2027-01-01', 'closed'],
  ])('%s에는 %s', (today, kind) => {
    expect(periodStatus(energy, on(today)).kind).toBe(kind);
  });
});

describe('periodBadge', () => {
  it('신청 전이면 언제부터인지', () => {
    expect(periodBadge(energy, on('2026-03-01'))).toEqual({ tone: 'upcoming', text: '올해 신청 6.15(월)부터' });
  });

  it('마감까지 여유가 있으면 언제까지인지', () => {
    expect(periodBadge(energy, on('2026-11-02'))).toEqual({ tone: 'open', text: '올해 신청 12.31(목)까지' });
  });

  it('마감 30일 전부터는 D-N으로 눈에 띄게', () => {
    expect(periodBadge(energy, on('2026-12-01'))).toEqual({ tone: 'soon', text: '신청 마감 D-30 · 12.31(목)' });
    expect(periodBadge(energy, on('2026-11-30')).tone).toBe('open');
  });

  it('마감 당일은 오늘 마감', () => {
    expect(periodBadge(energy, on('2026-12-31'))).toEqual({ tone: 'soon', text: '오늘 신청 마감' });
  });

  it('올해 마감됐으면 내년 공고를 확인하라고', () => {
    expect(periodBadge(period('2026-10-01', '2026-10-31'), on('2026-11-02'))).toEqual({
      tone: 'closed',
      text: '올해 신청 마감됨 · 내년 공고를 확인해 주세요',
    });
  });

  it('작년에 마감됐으면 그 해를 밝히고 올해 공고를 확인하라고', () => {
    expect(periodBadge(period('2025-01-01', '2025-12-19'), on('2026-11-02'))).toEqual({
      tone: 'closed',
      text: '2025년 신청 마감됨 · 올해 공고를 확인해 주세요',
    });
  });

  it('내년에 열리는 기간이면 그 해를 밝힌다', () => {
    expect(periodBadge(period('2027-01-02', '2027-02-28'), on('2026-11-02')).text).toBe('2027년 신청 1.2(토)부터');
  });

  it('하루짜리 기간', () => {
    expect(periodBadge(period('2026-10-01', '2026-10-01'), on('2026-10-01')).text).toBe('오늘 신청 마감');
  });
});
