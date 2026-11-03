import { beforeEach, describe, expect, it } from 'vitest';

import { Benefit } from '../../domain/benefit';
import { CurrentSources } from '../../domain/current-sources';
import { SourceRef } from '../../domain/source-ref';
import { BenefitCatalogService, CatalogError } from '../benefit-catalog.service';

import { benefitDetails } from './fakes/benefit-fixtures';
import { FakeBenefitCatalog } from './fakes/fake-benefit-catalog';
import { InMemoryBenefitRepository } from './fakes/in-memory-benefit.repository';

const at = new Date('2026-11-02T03:00:00Z');
const verified = (id: string) =>
  Benefit.register(benefitDetails(id)).verify(
    new CurrentSources([{ ref: new SourceRef('GOV24', id), hash: 'h', payload: {}, removed: false }]),
    at,
  );

describe('BenefitCatalogService.sync', () => {
  let catalog: FakeBenefitCatalog;
  let repo: InMemoryBenefitRepository;
  const sync = () => new BenefitCatalogService(catalog, repo).sync();

  beforeEach(() => {
    catalog = new FakeBenefitCatalog();
    repo = new InMemoryBenefitRepository();
  });

  it('처음이면 목록의 혜택을 모두 확인 전 상태로 등록한다', async () => {
    catalog.entries = [benefitDetails('1'), benefitDetails('2')];

    expect(await sync()).toEqual({ registered: ['gov24-1', 'gov24-2'], revised: [], regrouped: [], unchanged: 0, notInCatalog: [] });
    expect([...repo.benefits.values()].every((b) => b.verifiedAt === null)).toBe(true);
  });

  it('바뀐 게 없으면 저장하지 않고 확인 기록도 그대로 둔다', async () => {
    repo = new InMemoryBenefitRepository([verified('1')]);
    catalog.entries = [benefitDetails('1')];

    expect(await sync()).toMatchObject({ registered: [], revised: [], unchanged: 1 });
    expect(repo.saveCount).toBe(0);
    expect(repo.benefits.get('gov24-1')!.verifiedAt).toBe(at);
  });

  it('정보가 바뀐 혜택은 수정하고 다시 확인해야 하는 상태로 만든다', async () => {
    repo = new InMemoryBenefitRepository([verified('1')]);
    catalog.entries = [benefitDetails('1', { name: '이름 바꿈' })];

    expect(await sync()).toMatchObject({ revised: ['gov24-1'] });
    expect(repo.benefits.get('gov24-1')).toMatchObject({ name: '이름 바꿈', verifiedAt: null });
  });

  it('대상 묶음만 바뀐 혜택은 확인 기록을 유지하고 따로 알려준다', async () => {
    repo = new InMemoryBenefitRepository([verified('1')]);
    catalog.entries = [benefitDetails('1', { audience: 'LOW_INCOME' })];

    expect(await sync()).toMatchObject({ revised: [], regrouped: ['gov24-1'] });
    expect(repo.benefits.get('gov24-1')).toMatchObject({ audience: 'LOW_INCOME', verifiedAt: at });
  });

  it('확인 전 혜택도 원본 연결이 바뀌면 대상 묶음 변경이 아니라 수정으로 센다', async () => {
    repo = new InMemoryBenefitRepository([Benefit.register(benefitDetails('1'))]);
    catalog.entries = [benefitDetails('1', { sources: [new SourceRef('GOV24', '1'), new SourceRef('BOKJIRO_LOCAL', 'WLF1')] })];

    expect(await sync()).toMatchObject({ revised: ['gov24-1'], regrouped: [] });
  });

  it('목록에서 빠진 혜택은 지우지 않고 알려만 준다', async () => {
    repo = new InMemoryBenefitRepository([verified('1'), verified('2')]);
    catalog.entries = [benefitDetails('1')];

    expect((await sync()).notInCatalog).toEqual(['gov24-2']);
    expect(repo.benefits.has('gov24-2')).toBe(true);
  });

  it('목록이 비어 있으면 아무것도 바꾸지 않는다', async () => {
    repo = new InMemoryBenefitRepository([verified('1')]);

    expect(await sync()).toEqual({ registered: [], revised: [], regrouped: [], unchanged: 0, notInCatalog: ['gov24-1'] });
    expect(repo.saveCount).toBe(0);
  });

  it('같은 slug가 두 번 있으면 아무것도 반영하지 않는다', async () => {
    catalog.entries = [benefitDetails('1'), benefitDetails('2'), benefitDetails('1', { name: '중복' })];

    await expect(sync()).rejects.toThrow(new CatalogError('같은 slug가 두 번 이상 있습니다: gov24-1'));
    expect(repo.benefits.size).toBe(0);
  });

  it('잘못된 항목이 있으면 모든 문제를 알려주고 아무것도 반영하지 않는다', async () => {
    catalog.entries = [benefitDetails('1'), benefitDetails('2', { name: '' }), benefitDetails('3', { sources: [] })];

    const error = await sync().then(
      () => new Error('실패해야 하는데 성공함'),
      (e: Error) => e,
    );
    expect(error).toBeInstanceOf(CatalogError);
    expect(error.message).toContain('gov24-2: 이름이 비어 있습니다');
    expect(error.message).toContain('gov24-3: 연결된 원본이 없습니다');
    expect(repo.benefits.size).toBe(0);
  });
});
