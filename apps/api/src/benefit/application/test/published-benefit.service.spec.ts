import { describe, expect, it } from 'vitest';

import { sampleRegionService } from '../../../region/application/test/fakes/sample-region-service';
import { Benefit } from '../../domain/benefit';
import { SourceRef } from '../../domain/source-ref';
import { PublishedBenefitService } from '../published-benefit.service';

import { benefitDetails } from './fakes/benefit-fixtures';
import { FakeSourceStateReader } from './fakes/fake-source-state.reader';
import { InMemoryBenefitRepository } from './fakes/in-memory-benefit.repository';

const at = new Date('2026-11-02T03:00:00Z');
const ref = (id: string) => new SourceRef('GOV24', id);

describe('PublishedBenefitService', () => {
  it('혜택이 없으면 빈 목록', async () => {
    const service = new PublishedBenefitService(new InMemoryBenefitRepository(), new FakeSourceStateReader(), sampleRegionService());
    expect(await service.list()).toEqual([]);
  });

  it('원본이 사라진 혜택만 빼고 이름순으로, 검토 상태와 함께 내보낸다', async () => {
    const bok = new SourceRef('BOKJIRO_NATIONAL', 'WLF00001171');
    const reader = new FakeSourceStateReader().set(ref('1')).set(ref('2')).set(ref('3')).set(ref('4')).set(bok);
    const verify = async (benefit: Benefit) => benefit.verify(await reader.read(benefit.sources), at);

    const benefits = [
      await verify(Benefit.register(benefitDetails('1', { name: '하 확인됨' }))),
      await verify(Benefit.register(benefitDetails('2', { name: '나 바뀜' }))),
      await verify(Benefit.register(benefitDetails('3', { name: '다 사라짐' }))),
      Benefit.register(benefitDetails('4', { name: '라 확인 전' })),
      await verify(Benefit.register(benefitDetails('5', { name: '가 복지로', regionCode: '4311000000', sources: [bok, ref('1')] }))),
    ];
    reader.set(ref('2'), 'h2').remove(ref('3'));

    const published = await new PublishedBenefitService(new InMemoryBenefitRepository(benefits), reader, sampleRegionService()).list();

    expect(published).toEqual([
      expect.objectContaining({
        slug: 'gov24-5',
        name: '가 복지로',
        regionCode: '4311000000',
        regionName: '청주시',
        sourceName: '복지로',
        reviewStatus: 'VERIFIED',
      }),
      expect.objectContaining({ slug: 'gov24-2', sourceName: '보조금24', verifiedAt: at, reviewStatus: 'SOURCE_CHANGED' }),
      expect.objectContaining({ slug: 'gov24-4', name: '라 확인 전', verifiedAt: null, reviewStatus: 'UNVERIFIED' }),
      expect.objectContaining({ slug: 'gov24-1', reviewStatus: 'VERIFIED' }),
    ]);
  });
});
