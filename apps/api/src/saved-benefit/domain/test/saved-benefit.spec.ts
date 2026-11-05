import { describe, expect, it } from 'vitest';

import { InvalidSavedBenefitError, mergeSavedBenefits, toSavedBenefit } from '../saved-benefit';

describe('toSavedBenefit', () => {
  it('slug와 상태를 검사해 만든다', () => {
    expect(toSavedBenefit('gov24-447000000126', 'applied')).toEqual({ slug: 'gov24-447000000126', state: 'applied' });
  });

  it.each([
    ['', 'todo'],
    ['Gov24-1', 'todo'],
    ['a'.repeat(101), 'todo'],
    [3, 'todo'],
    ['gov24-1', 'done'],
    ['gov24-1', undefined],
  ])('잘못된 값 (%j, %j)은 거절한다', (slug, state) => {
    expect(() => toSavedBenefit(slug, state)).toThrow(InvalidSavedBenefitError);
  });

  it('경계: slug는 100자까지', () => {
    expect(toSavedBenefit('a'.repeat(100), 'todo').slug).toHaveLength(100);
  });
});

describe('mergeSavedBenefits', () => {
  it('양쪽을 합친다', () => {
    expect(mergeSavedBenefits([{ slug: 'a', state: 'todo' }], [{ slug: 'b', state: 'applied' }])).toEqual([
      { slug: 'a', state: 'todo' },
      { slug: 'b', state: 'applied' },
    ]);
  });

  it('같은 혜택이면 신청을 마친 쪽을 남긴다', () => {
    expect(mergeSavedBenefits([{ slug: 'a', state: 'applied' }], [{ slug: 'a', state: 'todo' }])).toEqual([
      { slug: 'a', state: 'applied' },
    ]);
    expect(mergeSavedBenefits([{ slug: 'a', state: 'todo' }], [{ slug: 'a', state: 'applied' }])).toEqual([
      { slug: 'a', state: 'applied' },
    ]);
  });

  it('한쪽이 비어 있으면 다른 쪽 그대로', () => {
    expect(mergeSavedBenefits([], [])).toEqual([]);
    expect(mergeSavedBenefits([], [{ slug: 'a', state: 'todo' }])).toEqual([{ slug: 'a', state: 'todo' }]);
  });
});
