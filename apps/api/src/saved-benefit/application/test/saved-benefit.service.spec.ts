import { describe, expect, it } from 'vitest';

import { InvalidSavedBenefitError, MAX_SAVED_BENEFITS } from '../../domain/saved-benefit';
import { SavedBenefitService } from '../saved-benefit.service';

import { InMemorySavedBenefitRepository } from './fakes/in-memory-saved-benefit-repository';

const now = new Date('2026-11-05T00:00:00Z');

function setup() {
  const repository = new InMemorySavedBenefitRepository();
  return { repository, service: new SavedBenefitService(repository) };
}

describe('SavedBenefitService', () => {
  it('저장하고, 신청했다고 바꾸고, 뺀다', async () => {
    const { service } = setup();
    await service.set('u1', 'a', 'todo', now);
    await service.set('u1', 'b', 'todo', now);
    await service.set('u1', 'a', 'applied', now);
    await service.remove('u1', 'b');
    expect(await service.list('u1')).toEqual([{ slug: 'a', state: 'applied' }]);
  });

  it('다른 사람의 목록과 섞이지 않는다', async () => {
    const { service } = setup();
    await service.set('u1', 'a', 'todo', now);
    expect(await service.list('u2')).toEqual([]);
  });

  it('없는 혜택을 빼도 오류가 아니다', async () => {
    await expect(setup().service.remove('u1', 'nope')).resolves.toBeUndefined();
  });

  it('경계: 500개까지 저장하고, 501번째는 거절한다. 이미 있는 것의 상태는 바꿀 수 있다', async () => {
    const { service, repository } = setup();
    await repository.upsert(
      'u1',
      Array.from({ length: MAX_SAVED_BENEFITS }, (_, i) => ({ slug: `s-${i}`, state: 'todo' as const })),
      now,
    );

    await expect(service.set('u1', 'one-more', 'todo', now)).rejects.toThrow(InvalidSavedBenefitError);
    await expect(service.set('u1', 's-0', 'applied', now)).resolves.toEqual({ slug: 's-0', state: 'applied' });
  });

  it('기기에 저장한 것을 합치면 계정 목록 전체를 돌려준다 (신청 완료가 우선)', async () => {
    const { service } = setup();
    await service.set('u1', 'a', 'applied', now);
    const merged = await service.mergeFromDevice(
      'u1',
      [
        { slug: 'a', state: 'todo' },
        { slug: 'b', state: 'todo' },
      ],
      now,
    );

    expect(merged).toEqual([
      { slug: 'a', state: 'applied' },
      { slug: 'b', state: 'todo' },
    ]);
    expect(await service.list('u1')).toEqual(merged);
  });

  it('합칠 것이 없으면 계정 목록 그대로', async () => {
    const { service } = setup();
    await service.set('u1', 'a', 'todo', now);
    expect(await service.mergeFromDevice('u1', [], now)).toEqual([{ slug: 'a', state: 'todo' }]);
  });

  it('합칠 목록에 잘못된 항목이 하나라도 있으면 아무것도 저장하지 않는다', async () => {
    const { service } = setup();
    await expect(
      service.mergeFromDevice(
        'u1',
        [
          { slug: 'a', state: 'todo' },
          { slug: 'B', state: 'todo' },
        ],
        now,
      ),
    ).rejects.toThrow(InvalidSavedBenefitError);
    await expect(service.mergeFromDevice('u1', 'x', now)).rejects.toThrow('목록');
    await expect(service.mergeFromDevice('u1', [null], now)).rejects.toThrow(InvalidSavedBenefitError);
    expect(await service.list('u1')).toEqual([]);
  });

  it('합친 결과가 500개를 넘으면 거절한다', async () => {
    const { service, repository } = setup();
    await repository.upsert(
      'u1',
      Array.from({ length: MAX_SAVED_BENEFITS }, (_, i) => ({ slug: `s-${i}`, state: 'todo' as const })),
      now,
    );
    await expect(service.mergeFromDevice('u1', [{ slug: 'new', state: 'todo' }], now)).rejects.toThrow('500개까지');
  });
});
