import { describe, expect, it } from 'vitest';

import { InvalidConditionsError } from '../../domain/saved-conditions';
import { ConditionsService, ConsentRequiredError } from '../conditions.service';

import { InMemoryConditionsRepository } from './fakes/in-memory-conditions-repository';

const first = new Date('2026-11-05T00:00:00Z');
const later = new Date('2026-11-06T00:00:00Z');
const input = (regionCode: null | string = '4311000000') => ({
  regionCode,
  household: { birthParent: 'unknown', partner: 'unknown', childcare: 'unknown' },
  children: [{ dueDate: '2027-04-24', birthDate: null, nickname: '콩이', name: '', birthOrder: null }],
});

function setup() {
  const repository = new InMemoryConditionsRepository();
  return { repository, service: new ConditionsService(repository) };
}

describe('ConditionsService', () => {
  it('처음 저장할 때 동의가 없으면 거절하고 아무것도 저장하지 않는다', async () => {
    const { service, repository } = setup();
    await expect(service.save('u1', input(), false, first)).rejects.toThrow(ConsentRequiredError);
    expect(repository.rows.size).toBe(0);
  });

  it('동의하고 저장하면 동의 시각을 남긴다', async () => {
    const { service } = setup();
    const saved = await service.save('u1', input(), true, first);
    expect([saved.consentedAt, saved.updatedAt, saved.conditions.regionCode]).toEqual([first, first, '4311000000']);
  });

  it('이미 동의했으면 다시 저장할 때 동의가 없어도 되고, 처음 동의 시각을 그대로 둔다', async () => {
    const { service } = setup();
    await service.save('u1', input(), true, first);
    const updated = await service.save('u1', input('4300000000'), false, later);
    expect([updated.consentedAt, updated.updatedAt, updated.conditions.regionCode]).toEqual([first, later, '4300000000']);
  });

  it('지우면 다음 저장 때 다시 동의를 받는다', async () => {
    const { service } = setup();
    await service.save('u1', input(), true, first);
    await service.delete('u1');
    expect(await service.find('u1')).toBeNull();
    await expect(service.save('u1', input(), false, later)).rejects.toThrow(ConsentRequiredError);
  });

  it('잘못된 조건은 동의 여부보다 먼저 거절한다', async () => {
    await expect(setup().service.save('u1', { regionCode: 'x' }, true, first)).rejects.toThrow(InvalidConditionsError);
  });

  it('다른 사람의 조건은 보이지 않는다', async () => {
    const { service } = setup();
    await service.save('u1', input(), true, first);
    expect(await service.find('u2')).toBeNull();
  });

  it('저장한 적 없는 사람이 지워도 오류가 아니다', async () => {
    await expect(setup().service.delete('nobody')).resolves.toBeUndefined();
  });
});
