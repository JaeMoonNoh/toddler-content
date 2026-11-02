import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Benefit } from '../../domain/benefit';
import { SourceRef } from '../../domain/source-ref';
import { CatalogError } from '../../application/sync-catalog.use-case';
import { parseCatalog } from './json-benefit-catalog';

const entry = (overrides: Record<string, unknown> = {}) => ({
  slug: 'gov24-1',
  name: '혜택',
  scope: 'national',
  sourceUrl: 'https://plus.gov.kr/x',
  sources: [{ source: 'GOV24', externalId: '1' }],
  ...overrides,
});
const parse = (value: unknown) => parseCatalog(JSON.stringify(value));

describe('parseCatalog', () => {
  it('항목을 혜택 정보로 바꾼다', () => {
    expect(parse([entry()])).toEqual([
      { slug: 'gov24-1', name: '혜택', scope: 'national', sourceUrl: 'https://plus.gov.kr/x', sources: [new SourceRef('GOV24', '1')], schedule: null, conditions: [] },
    ]);
  });

  it('신청 기간 규칙을 읽고, 빠진 months와 days는 0으로 본다', () => {
    const schedule = {
      from: { anchor: 'birth' },
      until: { anchor: 'birth', days: 59 },
      untilLabel: '소급 신청 마감',
      summary: '출생 후 60일 안에 신청',
      basis: { text: '60일 이내 신청', url: 'https://www.gov.kr' },
    };
    expect(parse([entry({ schedule })])[0].schedule).toEqual({
      ...schedule,
      from: { anchor: 'birth', months: 0, days: 0 },
      until: { anchor: 'birth', months: 0, days: 59 },
    });
  });

  it('조건을 읽는다', () => {
    expect(parse([entry({ conditions: ['EITHER_PARENT_INSURED'] })])[0].conditions).toEqual(['EITHER_PARENT_INSURED']);
  });

  it('빈 배열은 빈 목록', () => {
    expect(parse([])).toEqual([]);
  });

  it.each([
    ['JSON이 아님', '{', '올바른 JSON'],
    ['배열이 아님', '{}', '배열이어야'],
    ['이름이 숫자', JSON.stringify([entry({ name: 1 })]), 'name가 문자열'],
    ['항목이 null', JSON.stringify([null]), 'slug가 문자열'],
    ['sources 없음', JSON.stringify([entry({ sources: undefined })]), 'sources가 배열'],
    ['모르는 출처', JSON.stringify([entry({ sources: [{ source: 'NAVER', externalId: '1' }] })]), '알 수 없는 원본'],
    ['출처 ID 빈 값', JSON.stringify([entry({ sources: [{ source: 'GOV24', externalId: '' }] })]), '알 수 없는 원본'],
    ['모르는 기준일', JSON.stringify([entry({ schedule: { from: { anchor: 'due' }, until: { anchor: 'birth' } } })]), 'anchor는'],
    ['소수 날수', JSON.stringify([entry({ schedule: { from: { anchor: 'birth', days: 1.5 }, until: { anchor: 'birth' } } })]), '정수'],
    ['조건이 문자열 배열이 아님', JSON.stringify([entry({ conditions: 'BIRTH_PARENT_INSURED' })]), 'conditions는'],
    ['조건에 숫자', JSON.stringify([entry({ conditions: [1] })]), 'conditions는'],
    ['일정 설명 없음', JSON.stringify([entry({ schedule: { from: { anchor: 'birth' }, until: { anchor: 'birth' }, untilLabel: '마감' } })]), 'schedule.summary'],
  ])('%s이면 몇 번째 항목인지와 함께 거절한다', (_, text, message) => {
    expect(() => parseCatalog(text)).toThrow(CatalogError);
    expect(() => parseCatalog(text)).toThrow(message);
  });
});

describe('저장소의 혜택 목록 파일', () => {
  const details = parseCatalog(readFileSync(join(__dirname, '../../../../data/benefit-catalog.json'), 'utf8'));

  it('모든 항목이 혜택 규칙을 지킨다', () => {
    expect(() => details.forEach((d) => Benefit.register(d))).not.toThrow();
  });

  it('slug가 겹치지 않는다', () => {
    expect(new Set(details.map((d) => d.slug)).size).toBe(details.length);
  });
});
