import { describe, expect, it } from 'vitest';

import { printJudgmentDifferences } from '../cli/judgment-printer';

describe('printJudgmentDifferences', () => {
  it('같은 수와 갈린 후보를 두 판단 나란히 보여준다', () => {
    const text = printJudgmentDifferences(
      [
        {
          slug: 'a',
          a: { slug: 'a', decision: 'include', audience: 'LOW_INCOME' },
          b: { slug: 'a', decision: 'exclude', rule: 2, reason: '원문 "기초"' },
        },
        { slug: 'b', a: { slug: 'b', decision: 'merge', into: 'c' }, b: null },
      ],
      5,
    );
    expect(text.split('\n')).toEqual([
      '같음 3 · 다름 2',
      '- a',
      '  A: include LOW_INCOME',
      '  B: exclude 규칙2 | 원문 "기초"',
      '- b',
      '  A: merge→c',
      '  B: (판단 없음)',
    ]);
  });

  it('다른 게 없으면 같은 수만', () => {
    expect(printJudgmentDifferences([], 3)).toBe('같음 3 · 다름 0');
  });
});
