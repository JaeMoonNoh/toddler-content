import { beforeEach, describe, expect, it } from 'vitest';

import { Benefit } from '../../domain/benefit';
import { SourceRef } from '../../domain/source-ref';
import { BenefitReviewService } from '../benefit-review.service';

import { benefitDetails } from './fakes/benefit-fixtures';
import { FakeSourceStateReader } from './fakes/fake-source-state.reader';
import { InMemoryBenefitRepository } from './fakes/in-memory-benefit.repository';

const at = new Date('2026-11-02T03:00:00Z');
const ref = (id: string) => new SourceRef('GOV24', id);

describe('BenefitReviewService.changedCards', () => {
  let reader: FakeSourceStateReader;

  beforeEach(() => {
    reader = new FakeSourceStateReader();
  });

  const changedOf = (benefits: Benefit[]) => new BenefitReviewService(new InMemoryBenefitRepository(benefits), reader).changedCards();
  const verifiedNow = async (id: string, name = `혜택 ${id}`) =>
    Benefit.register(benefitDetails(id, { name })).verify(await reader.read([ref(id)]), at);

  it('혜택이 없으면 빈 목록', async () => {
    expect(await changedOf([])).toEqual([]);
  });

  it('원본이 바뀐 카드만 이름순으로, 카드 값과 바뀐 필드를 함께 돌려준다', async () => {
    ['1', '2', '3', '4'].forEach((id) => reader.set(ref(id), { 지원내용: '30만원' }));
    const changedB = await verifiedNow('1', '나 바뀜');
    const changedA = await verifiedNow('2', '가 바뀜');
    const same = await verifiedNow('3');
    const removed = await verifiedNow('4');
    reader.set(ref('1'), { 지원내용: '50만원' }).set(ref('2'), { 지원내용: '40만원' }).remove(ref('4'));

    const cards = await changedOf([changedB, Benefit.register(benefitDetails('9')), same, removed, changedA]);

    expect(cards.map(({ card }) => card.name)).toEqual(['가 바뀜', '나 바뀜']);
    expect(cards[1].card.slug).toBe('gov24-1');
    expect(cards[1].changes).toEqual([{ ref: ref('1'), fields: [{ field: '지원내용', before: '30만원', after: '50만원' }] }]);
  });
});
