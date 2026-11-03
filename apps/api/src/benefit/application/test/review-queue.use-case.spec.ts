import { beforeEach, describe, expect, it } from 'vitest';
import { Benefit } from '../../domain/benefit';
import { SourceRef } from '../../domain/source-ref';
import { benefitDetails } from './fakes/benefit-fixtures';
import { FakeSourceStateReader } from './fakes/fake-source-state.reader';
import { InMemoryBenefitRepository } from './fakes/in-memory-benefit.repository';
import { ReviewQueueUseCase } from '../review-queue.use-case';

const at = new Date('2026-11-02T03:00:00Z');
const ref = (id: string) => new SourceRef('GOV24', id);

describe('ReviewQueueUseCase', () => {
  let reader: FakeSourceStateReader;

  beforeEach(() => {
    reader = new FakeSourceStateReader();
  });

  const queueOf = (benefits: Benefit[]) => new ReviewQueueUseCase(new InMemoryBenefitRepository(benefits), reader).execute();
  const verifiedNow = async (id: string, name = `혜택 ${id}`) =>
    Benefit.register(benefitDetails(id, { name })).verify(await reader.read([ref(id)]), at);

  it('혜택이 없으면 빈 목록과 0건을 돌려준다', async () => {
    const queue = await queueOf([]);
    expect(queue.items).toEqual([]);
    expect(Object.values(queue.counts).every((count) => count === 0)).toBe(true);
  });

  it('확인된 혜택은 목록에 넣지 않고 건수에만 센다', async () => {
    reader.set(ref('1'));
    const queue = await queueOf([await verifiedNow('1')]);

    expect(queue.items).toEqual([]);
    expect(queue.counts.VERIFIED).toBe(1);
  });

  it('게시가 멈춘 것, 바뀐 것, 확인 전 순서로, 같은 상태끼리는 이름순으로 보여준다', async () => {
    ['1', '2', '3', '4', '5'].forEach((id) => reader.set(ref(id)));
    const changed = await verifiedNow('2', '나 바뀜');
    const removed = await verifiedNow('3', '다 사라짐');
    reader.set(ref('2'), 'h2').remove(ref('3'));

    const queue = await queueOf([
      Benefit.register(benefitDetails('1', { name: '하 확인 전' })),
      Benefit.register(benefitDetails('4', { name: '가 확인 전' })),
      changed,
      removed,
      Benefit.register(benefitDetails('9', { name: '라 원본 없음' })),
    ]);

    expect(queue.items.map((item) => [item.status.kind, item.name])).toEqual([
      ['SOURCE_MISSING', '라 원본 없음'],
      ['SOURCE_REMOVED', '다 사라짐'],
      ['SOURCE_CHANGED', '나 바뀜'],
      ['UNVERIFIED', '가 확인 전'],
      ['UNVERIFIED', '하 확인 전'],
    ]);
    expect(queue.counts).toEqual({ SOURCE_MISSING: 1, SOURCE_REMOVED: 1, SOURCE_CHANGED: 1, UNVERIFIED: 2, VERIFIED: 0 });
  });

  it('바뀐 혜택에는 마지막 확인일이 함께 나온다', async () => {
    reader.set(ref('1'));
    const benefit = await verifiedNow('1');
    reader.set(ref('1'), 'h2');

    expect((await queueOf([benefit])).items[0].verifiedAt).toBe(at);
  });
});
