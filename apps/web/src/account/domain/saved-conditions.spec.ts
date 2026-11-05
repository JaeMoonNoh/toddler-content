import { describe, expect, it } from 'vitest';
import { RegionTree } from '../../benefits/domain/region';
import { isSameConditions, toFinderInput, toSavedConditions, type FinderInput } from './saved-conditions';

const tree = new RegionTree([
  { code: '0000000000', name: '전국', fullName: '전국', parentCode: null },
  { code: '4300000000', name: '충청북도', fullName: '충청북도', parentCode: '0000000000' },
  { code: '4311000000', name: '청주시', fullName: '충청북도 청주시', parentCode: '4300000000' },
  { code: '3611000000', name: '세종특별자치시', fullName: '세종특별자치시', parentCode: '0000000000' },
]);

const input: FinderInput = {
  pick: { provinceCode: '4300000000', districtCode: '4311000000' },
  child: { dueText: '2027-04-24', nickname: ' 콩이 ', born: false, birthText: '2027-04-20', name: '' },
  household: { birthParent: 'insured', partner: 'unknown', birthOrder: 2, childcare: 'daycare' },
};

describe('toSavedConditions', () => {
  it('가장 좁게 고른 지역 하나와 아이 한 명으로 저장한다', () => {
    expect(toSavedConditions(input)).toEqual({
      regionCode: '4311000000',
      household: { birthParent: 'insured', partner: 'unknown', childcare: 'daycare' },
      children: [{ dueDate: '2027-04-24', birthDate: null, nickname: '콩이', name: '', birthOrder: 2 }],
    });
  });

  it('태어났다고 체크하지 않았으면 적어 둔 출생일은 저장하지 않는다', () => {
    expect(toSavedConditions(input).children[0].birthDate).toBeNull();
    expect(toSavedConditions({ ...input, child: { ...input.child, born: true } }).children[0].birthDate).toBe('2027-04-20');
  });

  it('아무것도 고르지 않았으면 빈 값으로 저장한다', () => {
    const empty = toSavedConditions({
      pick: { provinceCode: '', districtCode: '' },
      child: { dueText: '', nickname: '', born: false, birthText: '', name: '' },
      household: { birthParent: 'unknown', partner: 'unknown', birthOrder: null, childcare: 'unknown' },
    });
    expect([empty.regionCode, empty.children[0].dueDate]).toEqual([null, null]);
  });
});

describe('toFinderInput', () => {
  it('저장한 조건을 화면 입력으로 되돌린다', () => {
    const restored = toFinderInput(toSavedConditions({ ...input, child: { ...input.child, born: true } }), tree);
    expect(restored).toEqual({ ...input, child: { ...input.child, nickname: '콩이', born: true } });
  });

  it('시·도만 골랐으면 시·도만 채운다 (세종처럼 시·군·구가 없는 곳 포함)', () => {
    const saved = { ...toSavedConditions(input), regionCode: '3611000000' };
    expect(toFinderInput(saved, tree).pick).toEqual({ provinceCode: '3611000000', districtCode: '' });
  });

  it('지금 지역 목록에 없는 코드면 사는 곳을 비운다', () => {
    const saved = { ...toSavedConditions(input), regionCode: '9999999999' };
    expect(toFinderInput(saved, tree).pick).toEqual({ provinceCode: '', districtCode: '' });
  });

  it('아이가 없으면 날짜와 이름을 비운다', () => {
    const restored = toFinderInput({ ...toSavedConditions(input), children: [] }, tree);
    expect([restored.child.dueText, restored.child.born, restored.household.birthOrder]).toEqual(['', false, null]);
  });
});

describe('isSameConditions', () => {
  it('하나라도 바뀌면 다르다', () => {
    const saved = toSavedConditions(input);
    expect(isSameConditions(saved, toSavedConditions(input))).toBe(true);
    expect(isSameConditions(saved, toSavedConditions({ ...input, pick: { ...input.pick, districtCode: '' } }))).toBe(false);
  });
});
