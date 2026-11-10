import { describe, expect, it } from 'vitest';

import { sampleRegionService } from '../../../region/application/test/fakes/sample-region-service';
import { SourceRef } from '../../domain/source-ref';
import { BenefitCatalogService } from '../benefit-catalog.service';

import { benefitDetails } from './fakes/benefit-fixtures';
import { FakeBenefitCatalog } from './fakes/fake-benefit-catalog';
import { InMemoryBenefitRepository } from './fakes/in-memory-benefit.repository';

import type { SourceId } from '../../../shared/domain/source-id';
import type { BenefitDetails } from '../../domain/benefit';

const BOKJIRO: SourceId[] = ['BOKJIRO_LOCAL', 'BOKJIRO_NATIONAL'];
const linkedSources = (entries: BenefitDetails[], sources = BOKJIRO) =>
  new BenefitCatalogService(new FakeBenefitCatalog(entries), new InMemoryBenefitRepository(), sampleRegionService()).linkedSources(sources);
const keysOf = (refs: SourceRef[]) => refs.map((ref) => ref.key);

describe('BenefitCatalogService.linkedSources', () => {
  it('목록이 비어 있으면 빈 목록', async () => {
    expect(await linkedSources([])).toEqual([]);
  });

  it('고른 출처의 원본만 목록 순서대로 모은다', async () => {
    const entries = [
      benefitDetails('1', { sources: [new SourceRef('GOV24', 'G1'), new SourceRef('BOKJIRO_LOCAL', 'L1')] }),
      benefitDetails('2', { sources: [new SourceRef('BOKJIRO_NATIONAL', 'N1')] }),
    ];

    expect(keysOf(await linkedSources(entries))).toEqual(['BOKJIRO_LOCAL:L1', 'BOKJIRO_NATIONAL:N1']);
  });

  it('여러 혜택이 같은 원본을 가리켜도 한 번만', async () => {
    const shared = new SourceRef('BOKJIRO_LOCAL', 'L1');
    const entries = [benefitDetails('1', { sources: [shared] }), benefitDetails('2', { sources: [new SourceRef('BOKJIRO_LOCAL', 'L1')] })];

    expect(keysOf(await linkedSources(entries))).toEqual(['BOKJIRO_LOCAL:L1']);
  });

  it('고른 출처가 없으면 빈 목록', async () => {
    expect(await linkedSources([benefitDetails('1', { sources: [new SourceRef('BOKJIRO_LOCAL', 'L1')] })], [])).toEqual([]);
  });
});
