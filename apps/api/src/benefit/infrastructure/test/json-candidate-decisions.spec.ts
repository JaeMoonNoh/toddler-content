import { describe, expect, it } from 'vitest';

import { CatalogError } from '../../application/benefit-catalog.service';
import { parseDecisions } from '../catalog/json-candidate-decisions';

const parse = (value: unknown) => parseDecisions(JSON.stringify(value));

describe('parseDecisions', () => {
  it('판단 항목을 읽는다', () => {
    expect(
      parse([
        { slug: 'gov24-1', merge: ['bokjiro-w1'], name: '이름', audience: 'MULTI_CHILD', conditions: ['HOME_CARE'] },
        { slug: 'gov24-2' },
      ]),
    ).toEqual([
      { slug: 'gov24-1', merge: ['bokjiro-w1'], name: '이름', audience: 'MULTI_CHILD', conditions: ['HOME_CARE'] },
      { slug: 'gov24-2', merge: undefined, name: undefined, audience: undefined, conditions: undefined },
    ]);
  });

  it.each([
    ['slug 없음', [{ merge: [] }], 'slug가 문자열이 아닙니다'],
    ['merge가 문자열', [{ slug: 'gov24-1', merge: 'bokjiro-w1' }], 'merge는 문자열 배열이어야 합니다'],
    ['audience가 숫자', [{ slug: 'gov24-1', audience: 1 }], 'audience가 문자열이 아닙니다'],
    ['배열이 아님', { slug: 'gov24-1' }, '배열이어야 합니다'],
  ])('%s이면 거절한다', (_, value, message) => {
    expect(() => parse(value)).toThrow(CatalogError);
    expect(() => parse(value)).toThrow(message);
  });

  it('JSON이 아니면 거절한다', () => {
    expect(() => parseDecisions('[{')).toThrow('판단 파일이 올바른 JSON이 아닙니다');
  });
});
