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
      { slug: 'gov24-1', name: '혜택', scope: 'national', sourceUrl: 'https://plus.gov.kr/x', sources: [new SourceRef('GOV24', '1')] },
    ]);
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
