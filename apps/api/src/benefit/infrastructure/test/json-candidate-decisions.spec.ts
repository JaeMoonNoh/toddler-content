import { describe, expect, it } from 'vitest';

import { CatalogError } from '../../application/benefit-catalog.service';
import { parseDecisions, parseJudgments } from '../catalog/json-candidate-decisions';

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

  it('고르기 규칙의 판단 파일을 넣을 카드 목록으로 바꾼다 (합칠 후보는 대표의 원본으로)', () => {
    expect(
      parse([
        { slug: 'gov24-1', decision: 'include', audience: 'MULTI_CHILD', note: '' },
        { slug: 'bokjiro-w1', decision: 'merge', into: 'gov24-1' },
        { slug: 'bokjiro-w2', decision: 'merge', into: 'gov24-1' },
        { slug: 'gov24-2', decision: 'exclude', rule: 4, reason: '원문 "초등학생"' },
        { slug: 'gov24-3', decision: 'include', conditions: ['HOME_CARE'] },
      ]),
    ).toEqual([
      { slug: 'gov24-1', merge: ['bokjiro-w1', 'bokjiro-w2'], name: undefined, audience: 'MULTI_CHILD', conditions: undefined },
      { slug: 'gov24-3', merge: undefined, name: undefined, audience: undefined, conditions: ['HOME_CARE'] },
    ]);
  });

  it('모두 뺐으면 넣을 카드가 없다', () => {
    expect(parse([{ slug: 'gov24-2', decision: 'exclude', rule: 2 }])).toEqual([]);
  });

  it.each([
    [
      '넣지 않는 후보로 합침',
      [
        { slug: 'b', decision: 'merge', into: 'gov24-2' },
        { slug: 'gov24-2', decision: 'exclude' },
      ],
      '넣기로 한 후보가 아닙니다',
    ],
    ['into 없는 merge', [{ slug: 'b', decision: 'merge' }], 'into(합칠 대표 slug)가 필요합니다'],
    ['모르는 decision', [{ slug: 'b', decision: 'maybe' }], 'decision은 include|merge|exclude'],
  ])('판단 파일에서 %s이면 거절한다', (_, value, message) => {
    expect(() => parse(value)).toThrow(message);
  });

  it('판단 파일의 이유와 메모를 그대로 읽는다 (두 판단 비교용)', () => {
    expect(parseJudgments(JSON.stringify([{ slug: 'a', decision: 'exclude', rule: 4, reason: 'r', note: 'n' }]))[0]).toMatchObject({
      decision: 'exclude',
      rule: 4,
      reason: 'r',
      note: 'n',
    });
  });

  it('JSON이 아니면 거절한다', () => {
    expect(() => parseDecisions('[{')).toThrow('판단 파일이 올바른 JSON이 아닙니다');
  });
});
