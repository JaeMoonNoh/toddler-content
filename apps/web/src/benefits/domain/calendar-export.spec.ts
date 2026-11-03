import { describe, expect, it } from 'vitest';
import type { BenefitSchedule, PublishedBenefit } from './benefit';
import { CalendarDate } from './calendar-date';
import { deadlineEventsOf } from './deadline-event';
import { googleCalendarUrl } from './google-calendar';
import { escapeText, fold, IcsCalendar } from './ics-calendar';
import { RegionTree } from './region';
import { buildTimeline } from './timeline';

const due = CalendarDate.parse('2027-05-06')!;
const region = new RegionTree([]).choose(null); // 전국만
const schedule = (fromDays: number, untilDays: number, untilLabel = '소급 신청 마감'): BenefitSchedule => ({
  from: { anchor: 'birth', months: 0, days: fromDays },
  until: { anchor: 'birth', months: 0, days: untilDays },
  untilLabel,
  summary: '출생일 포함 60일 안에 신청해야 해요',
  basis: { text: '근거', url: 'https://a.kr' },
});
const benefit = (slug: string, name: string, s: BenefitSchedule | null, reviewStatus: PublishedBenefit['reviewStatus'] = 'UNVERIFIED'): PublishedBenefit => ({
  slug,
  name,
  regionCode: '0000000000',
  regionName: '전국',
  sourceName: '복지로',
  sourceUrl: `https://www.bokjiro.go.kr/${slug}`,
  verifiedAt: null,
  reviewStatus,
  schedule: s,
  conditions: [],
  amount: null,
  applicationPeriod: null,
  howToApply: null,
  audience: null,
});
const eventsOn = (today: string, benefits: PublishedBenefit[]) =>
  deadlineEventsOf(buildTimeline(region, benefits, due, CalendarDate.parse(today)!));

describe('deadlineEventsOf', () => {
  const benefits = [
    benefit('parent', '부모급여 지원', schedule(0, 59)),
    benefit('voucher', '산모·신생아 건강관리', schedule(-40, 60, '신청 마감')),
    benefit('leave', '출산전후휴가 급여', schedule(-45, 0, '휴가 시작')),
    benefit('none', '규칙 없음', null),
  ];

  it('마감일 순서로, 마감의 뜻과 이름을 제목으로 만든다', () => {
    const events = eventsOn('2026-11-02', benefits);
    expect(events.map((e) => [e.date.toIso(), e.title])).toEqual([
      ['2027-05-06', '[휴가 시작] 출산전후휴가 급여'],
      ['2027-07-04', '[소급 신청 마감] 부모급여 지원'],
      ['2027-07-05', '[신청 마감] 산모·신생아 건강관리'],
    ]);
  });

  it('이미 지난 마감은 넣지 않는다 (마감 당일은 넣는다)', () => {
    expect(eventsOn('2027-07-04', benefits).map((e) => e.uid)).toEqual(['parent-20270704@toddler-content', 'voucher-20270705@toddler-content']);
    expect(eventsOn('2027-07-06', benefits)).toEqual([]);
  });

  it('설명에 기간, 검증 전 안내, 계산 기준, 원문 링크를 넣는다', () => {
    const [event] = eventsOn('2026-11-02', [benefit('parent', '부모급여 지원', schedule(0, 59))]);
    expect(event.description.split('\n')).toEqual([
      '출생일 포함 60일 안에 신청해야 해요',
      '기간: 2027.5.6(목) ~ 2027.7.4(일)',
      '아직 검증 전인 정보예요. 신청 전에 원문을 확인해 주세요.',
      '출산예정일에 태어난다고 보고 계산한 날짜예요.',
      '원문: https://www.bokjiro.go.kr/parent',
    ]);
  });

  it('임신 0주에 시작하는 혜택은 기간을 "임신 확인 후"부터로 쓴다', () => {
    const pregnancy: BenefitSchedule = { ...schedule(0, 0, '출산 전까지'), from: { anchor: 'pregnancy', months: 0, days: 0 } };
    const [event] = eventsOn('2026-11-02', [benefit('folic', '엽산제', pregnancy)]);
    expect(event.description).toContain('기간: 임신 확인 후 ~ 2027.5.6(목)');
  });

  it('확인된 혜택에는 검증 전 안내를 넣지 않는다', () => {
    const [event] = eventsOn('2026-11-02', [benefit('parent', '부모급여', schedule(0, 59), 'VERIFIED')]);
    expect(event.description).not.toContain('검증 전');
  });
});

describe('IcsCalendar', () => {
  const createdAt = new Date('2026-11-02T03:04:05.678Z');
  const [event] = eventsOn('2026-11-02', [benefit('parent', '부모급여 지원', schedule(0, 59))]);
  const ics = new IcsCalendar([event], createdAt).toString();
  const unfolded = ics.replace(/\r\n /g, '');

  it('모든 줄을 CRLF로 끝내고 달력 하나로 감싼다', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(ics.replace(/\r\n/g, '')).not.toMatch(/\n/);
  });

  it('하루 종일 일정으로 넣고, 끝나는 날은 다음 날로 쓴다', () => {
    expect(unfolded).toContain('DTSTART;VALUE=DATE:20270704\r\nDTEND;VALUE=DATE:20270705');
  });

  it('마감 3일 전에 알린다', () => {
    expect(unfolded).toContain('TRIGGER:-P3D');
  });

  it('만든 시각은 UTC 형식', () => {
    expect(unfolded).toContain('DTSTAMP:20261102T030405Z');
  });

  it('설명의 줄바꿈을 \\n으로 바꾼다', () => {
    expect(unfolded).toContain('DESCRIPTION:출생일 포함 60일 안에 신청해야 해요\\n기간: 2027.5.6(목) ~ 2027.7.4(일)\\n');
  });

  it('마감이 없으면 빈 달력', () => {
    expect(new IcsCalendar([], createdAt).toString()).not.toContain('VEVENT');
  });

  it('모든 줄이 75바이트를 넘지 않는다', () => {
    const encoder = new TextEncoder();
    expect(ics.split('\r\n').every((line) => encoder.encode(line).length <= 75)).toBe(true);
  });
});

describe('escapeText', () => {
  it('역슬래시, 세미콜론, 쉼표, 줄바꿈을 이스케이프한다', () => {
    expect(escapeText('a\\b;c,d\ne\r\nf')).toBe('a\\\\b\;c\\,d\\ne\\nf');
  });
});

describe('fold', () => {
  const encoder = new TextEncoder();

  it('75바이트 이하면 그대로 둔다', () => {
    expect(fold('a'.repeat(75))).toBe('a'.repeat(75));
  });

  it('76바이트부터 접고, 이어지는 줄은 공백으로 시작한다', () => {
    expect(fold('a'.repeat(76))).toBe(`${'a'.repeat(75)}\r\n a`);
  });

  it('한글을 글자 중간에서 자르지 않는다', () => {
    const folded = fold('가'.repeat(60));
    const lines = folded.split('\r\n');
    expect(lines.every((line) => encoder.encode(line).length <= 75)).toBe(true);
    expect(folded.replace(/\r\n /g, '')).toBe('가'.repeat(60));
  });

  it('빈 줄은 빈 줄', () => {
    expect(fold('')).toBe('');
  });
});

describe('googleCalendarUrl', () => {
  it('하루 종일 일정으로 제목, 날짜, 설명을 담는다', () => {
    const [event] = eventsOn('2026-11-02', [benefit('parent', '부모급여 지원', schedule(0, 59))]);
    const url = new URL(googleCalendarUrl(event));

    expect(url.origin + url.pathname).toBe('https://calendar.google.com/calendar/render');
    expect(url.searchParams.get('action')).toBe('TEMPLATE');
    expect(url.searchParams.get('text')).toBe('[소급 신청 마감] 부모급여 지원');
    expect(url.searchParams.get('dates')).toBe('20270704/20270705');
    expect(url.searchParams.get('details')).toContain('기간: 2027.5.6(목) ~ 2027.7.4(일)');
  });
});
