import { describe, expect, it } from 'vitest';
import { Benefit } from '../domain/benefit';
import { SourceRef } from '../domain/source-ref';
import { BenefitDetailUseCase } from './benefit-detail.use-case';
import { benefitDetails } from './fakes/benefit-fixtures';
import { FakeSourceStateReader } from './fakes/fake-source-state.reader';
import { InMemoryBenefitRepository } from './fakes/in-memory-benefit.repository';

const gov = new SourceRef('GOV24', '1');
const bok = new SourceRef('BOKJIRO_NATIONAL', 'WLF1');

describe('BenefitDetailUseCase', () => {
  const detailOf = (slug: string, reader = new FakeSourceStateReader().set(gov, 'h1', { 지원내용: '월 10만원' })) =>
    new BenefitDetailUseCase(new InMemoryBenefitRepository([Benefit.register(benefitDetails('1', { sources: [gov, bok] }))]), reader).execute(slug);

  it('혜택, 검토 상태, 연결된 원본의 지금 모습을 함께 돌려준다', async () => {
    const detail = await detailOf('gov24-1', new FakeSourceStateReader().set(gov, 'h1', { 지원내용: '월 10만원' }).set(bok));

    expect(detail?.benefit.slug).toBe('gov24-1');
    expect(detail?.status).toEqual({ kind: 'UNVERIFIED' });
    expect(detail?.sources.map((s) => [s.ref.key, s.state?.payload])).toEqual([
      ['GOV24:1', { 지원내용: '월 10만원' }],
      ['BOKJIRO_NATIONAL:WLF1', {}],
    ]);
  });

  it('수집된 적 없는 원본은 null로 알려준다', async () => {
    const detail = await detailOf('gov24-1');
    expect(detail?.status.kind).toBe('SOURCE_MISSING');
    expect(detail?.sources[1].state).toBeNull();
  });

  it('없는 혜택이면 null', async () => {
    expect(await detailOf('gov24-404')).toBeNull();
  });
});
