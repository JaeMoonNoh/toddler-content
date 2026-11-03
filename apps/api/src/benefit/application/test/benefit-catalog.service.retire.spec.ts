import { beforeEach, describe, expect, it } from 'vitest';

import { Benefit } from '../../domain/benefit';
import { BenefitCatalogService } from '../benefit-catalog.service';

import { benefitDetails } from './fakes/benefit-fixtures';
import { FakeBenefitCatalog } from './fakes/fake-benefit-catalog';
import { InMemoryBenefitRepository } from './fakes/in-memory-benefit.repository';

describe('BenefitCatalogService.retire', () => {
  let repo: InMemoryBenefitRepository;
  let catalog: FakeBenefitCatalog;
  const retire = (slugs: string[]) => new BenefitCatalogService(catalog, repo).retire(slugs);

  beforeEach(() => {
    repo = new InMemoryBenefitRepository(['1', '2'].map((id) => Benefit.register(benefitDetails(id))));
    catalog = new FakeBenefitCatalog([benefitDetails('1')]);
  });

  it('목록 파일에서 뺀 혜택을 지운다', async () => {
    expect(await retire(['gov24-2'])).toEqual({ retired: ['gov24-2'], failed: [] });
    expect([...repo.benefits.keys()]).toEqual(['gov24-1']);
  });

  it('목록 파일에 아직 있는 혜택은 지우지 않는다', async () => {
    const result = await retire(['gov24-1']);
    expect(result.failed[0]).toMatchObject({ slug: 'gov24-1', reason: expect.stringContaining('먼저 빼') });
    expect(repo.benefits.has('gov24-1')).toBe(true);
  });

  it('없는 혜택은 실패로 알려주고 나머지는 지운다', async () => {
    expect(await retire(['gov24-404', 'gov24-2'])).toEqual({
      retired: ['gov24-2'],
      failed: [{ slug: 'gov24-404', reason: '없는 혜택입니다' }],
    });
  });

  it('같은 slug를 두 번 넣어도 한 번만', async () => {
    expect((await retire(['gov24-2', 'gov24-2'])).retired).toEqual(['gov24-2']);
  });

  it('아무것도 지울 게 없으면 저장소를 건드리지 않는다', async () => {
    await retire([]);
    expect(repo.benefits.size).toBe(2);
    expect(repo.deleteCount).toBe(0);
  });
});
