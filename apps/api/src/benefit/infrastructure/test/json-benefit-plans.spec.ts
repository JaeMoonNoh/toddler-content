import { describe, expect, it } from 'vitest';

import { CatalogError } from '../../application/benefit-catalog.service';
import { BenefitPlan } from '../../domain/benefit-plan';
import { parsePlans } from '../catalog/json-benefit-plans';

const URL = 'https://plus.gov.kr/x';
const parse = (value: unknown) => parsePlans(JSON.stringify(value));

describe('parsePlans', () => {
  it('초안 항목을 BenefitPlan으로 바꾼다', () => {
    const amount = { kind: 'cash', summary: '50만원', tiers: null, basis: { text: '50만원', url: URL } };

    expect(parse([{ slug: 'gov24-1', schedule: null, amount, applicationPeriod: null, note: '애매함' }])).toEqual([
      new BenefitPlan('gov24-1', null, { ...amount, kind: 'cash' }, null, '애매함'),
    ]);
  });

  it('note가 없으면 빈 문자열로 둔다', () => {
    expect(parse([{ slug: 'gov24-1', schedule: null, amount: null, applicationPeriod: null }])[0].note).toBe('');
  });

  it('필드를 빠뜨리면 null로 적으라고 알린다', () => {
    expect(() => parse([{ slug: 'gov24-1', schedule: null }])).toThrow(
      'amount, applicationPeriod가 없습니다 (정할 수 없으면 null로 적어 주세요)',
    );
  });

  it('일정 기준점이 틀리면 알린다', () => {
    const schedule = { from: { anchor: 'due' }, until: { anchor: 'birth' }, untilLabel: '', summary: '', basis: { text: '', url: URL } };
    expect(() => parse([{ slug: 'gov24-1', schedule, amount: null, applicationPeriod: null }])).toThrow(
      'anchor는 pregnancy 또는 birth여야 합니다',
    );
  });

  it('배열이 아니거나 JSON이 아니면 알린다', () => {
    expect(() => parse({ slug: 'gov24-1' })).toThrow(CatalogError);
    expect(() => parsePlans('[{')).toThrow('초안이 올바른 JSON이 아닙니다');
  });

  it('빈 배열은 빈 초안', () => {
    expect(parse([])).toEqual([]);
  });
});
