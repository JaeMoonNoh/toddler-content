import { describe, expect, it } from 'vitest';

import { InvalidConditionsError, SavedConditions } from '../saved-conditions';

const valid = {
  regionCode: '4311000000',
  household: { birthParent: 'insured', partner: 'unknown', childcare: 'daycare' },
  children: [{ dueDate: '2027-04-24', birthDate: null, nickname: '콩이', name: '', birthOrder: 1 }],
};

const problemsOf = (value: unknown) => {
  try {
    SavedConditions.parse(value);
    return null;
  } catch (error) {
    expect(error).toBeInstanceOf(InvalidConditionsError);
    return (error as Error).message;
  }
};

describe('SavedConditions.parse', () => {
  it('아는 칸만 골라 담는다 (다른 값은 버린다)', () => {
    const parsed = SavedConditions.parse({ ...valid, email: 'a@b.c', children: [{ ...valid.children[0], memo: 'x' }] });
    expect(parsed.toJSON()).toEqual(valid);
  });

  it('비어 있는 조건도 저장할 수 있다', () => {
    const empty = { regionCode: null, household: { birthParent: 'unknown', partner: 'unknown', childcare: 'unknown' }, children: [] };
    expect(SavedConditions.parse(empty).toJSON()).toEqual(empty);
  });

  it('태명·이름은 앞뒤 공백을 떼고, 없으면 빈 글자로 둔다', () => {
    const parsed = SavedConditions.parse({
      ...valid,
      children: [{ dueDate: null, birthDate: null, nickname: ' 튼튼 ', birthOrder: null }],
    });
    expect(parsed.children[0]).toEqual({ dueDate: null, birthDate: null, nickname: '튼튼', name: '', birthOrder: null });
  });

  it('경계: 이름은 10자까지', () => {
    expect(problemsOf({ ...valid, children: [{ ...valid.children[0], name: '가'.repeat(10) }] })).toBeNull();
    expect(problemsOf({ ...valid, children: [{ ...valid.children[0], name: '가'.repeat(11) }] })).toContain('children[0].name: 10자까지');
  });

  it('경계: 아이는 5명까지', () => {
    expect(problemsOf({ ...valid, children: Array(5).fill(valid.children[0]) })).toBeNull();
    expect(problemsOf({ ...valid, children: Array(6).fill(valid.children[0]) })).toContain('5명까지');
  });

  it.each([
    [{ ...valid, regionCode: '43110' }, 'regionCode: 형식'],
    [{ ...valid, household: { ...valid.household, partner: 'yes' } }, 'household.partner'],
    [{ ...valid, household: undefined }, 'household.birthParent'],
    [{ ...valid, children: 'x' }, 'children: 목록'],
    [{ ...valid, children: [{ ...valid.children[0], dueDate: '2027-02-30' }] }, 'children[0].dueDate: 없는 날짜'],
    [{ ...valid, children: [{ ...valid.children[0], birthDate: '2027/01/01' }] }, 'children[0].birthDate: 형식'],
    [{ ...valid, children: [{ ...valid.children[0], birthOrder: 4 }] }, 'children[0].birthOrder'],
    [{ ...valid, children: [{ ...valid.children[0], nickname: 3 }] }, 'children[0].nickname: 글자'],
    [null, 'children: 목록'],
  ])('잘못된 값은 이유를 모아 거절한다 %#', (value, problem) => {
    expect(problemsOf(value)).toContain(problem);
  });
});
