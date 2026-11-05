import { describe, expect, it } from 'vitest';

import { type CandidateJudgment, judgmentDifferences } from '../candidate-judgment';

const include = (slug: string, more: Partial<CandidateJudgment> = {}): CandidateJudgment => ({ slug, decision: 'include', ...more });

describe('judgmentDifferences', () => {
  it('같은 판단은 이유 문구가 달라도 같다고 본다', () => {
    const a = [include('a', { note: '하나' }), { slug: 'b', decision: 'exclude' as const, rule: 4, reason: '원문 "초등"' }];
    const b = [include('a', { note: '둘' }), { slug: 'b', decision: 'exclude' as const, rule: 2, reason: '다른 이유' }];
    expect(judgmentDifferences(a, b)).toEqual([]);
  });

  it('결정, 합칠 대상, 대상 묶음, 조건이 다르면 알린다', () => {
    const a = [
      include('1'),
      { slug: '2', decision: 'merge' as const, into: 'x' },
      include('3', { audience: 'LOW_INCOME' }),
      include('4', { conditions: ['HOME_CARE'] }),
    ];
    const b = [
      { slug: '1', decision: 'exclude' as const, rule: 2 },
      { slug: '2', decision: 'merge' as const, into: 'y' },
      include('3'),
      include('4', { conditions: ['USES_CHILDCARE'] }),
    ];
    expect(judgmentDifferences(a, b).map((d) => d.slug)).toEqual(['1', '2', '3', '4']);
  });

  it('조건은 순서가 달라도 같다', () => {
    expect(
      judgmentDifferences(
        [include('a', { conditions: ['HOME_CARE', 'EITHER_PARENT_INSURED'] })],
        [include('a', { conditions: ['EITHER_PARENT_INSURED', 'HOME_CARE'] })],
      ),
    ).toEqual([]);
  });

  it('한쪽에만 있는 후보도 알린다', () => {
    expect(judgmentDifferences([include('a')], [])).toEqual([{ slug: 'a', a: include('a'), b: null }]);
  });

  it('둘 다 비어 있으면 다른 게 없다', () => {
    expect(judgmentDifferences([], [])).toEqual([]);
  });
});
