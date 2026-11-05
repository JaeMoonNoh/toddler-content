import { describe, expect, it } from 'vitest';
import { babySizeOf } from './baby-size';
import type { ChildStage } from './pregnancy';

const pregnant = (weeks: number): ChildStage => ({ kind: 'pregnant', weeks, days: 0, daysUntilDue: 280 - weeks * 7 });

describe('babySizeOf', () => {
  it.each([
    [0, '작은 씨앗'],
    [4, '작은 씨앗'],
    [5, '콩알'],
    [12, '레몬'],
    [13, '레몬'],
    [16, '사과'],
    [36, '멜론'],
    [37, '수박'],
    [40, '수박'],
  ])('임신 %i주는 %s', (weeks, fruit) => {
    expect(babySizeOf(pregnant(weeks))?.fruit).toBe(fruit);
  });

  it('출산예정일이 지났으면 수박', () => {
    expect(babySizeOf({ kind: 'after-due', daysSinceDue: 3 })?.fruit).toBe('수박');
  });

  it.each<ChildStage>([{ kind: 'too-far', daysUntilDue: 300 }, { kind: 'born', daysSinceBirth: 1, months: 0 }, { kind: 'birth-in-future' }])(
    '임신 중이 아니면 크기가 없다: %j',
    (stage) => {
      expect(babySizeOf(stage)).toBeNull();
    },
  );
});
