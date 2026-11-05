import { beforeEach, describe, expect, it } from 'vitest';

import { sampleRegionService } from '../../../region/application/test/fakes/sample-region-service';
import { BenefitPlan } from '../../domain/benefit-plan';
import { SourceRef } from '../../domain/source-ref';
import { CatalogError } from '../benefit-catalog.service';
import { BenefitPlanService } from '../benefit-plan.service';

import { benefitDetails } from './fakes/benefit-fixtures';
import { FakeBenefitCatalog } from './fakes/fake-benefit-catalog';
import { FakeSourceStateReader } from './fakes/fake-source-state.reader';

import type { BenefitAmount } from '../../domain/benefit-amount';

const CHUNGBUK = '4300000000';
const CHEONGJU = '4311000000';
const SEJONG = '3611000000';

const amountFor = (id: string, won = 500000): BenefitAmount => ({
  kind: 'cash',
  summary: `${won / 10000}만원`,
  tiers: [{ minBirthOrder: 1, maxBirthOrder: null, won }],
  basis: { text: `${won}원 지급`, url: `https://plus.gov.kr/benefit?svcId=${id}` },
});
const planOf = (id: string, amount: BenefitAmount | null = amountFor(id)) => new BenefitPlan(`gov24-${id}`, null, amount, null, '');

describe('BenefitPlanService', () => {
  let catalog: FakeBenefitCatalog;
  let sources: FakeSourceStateReader;
  const service = () => new BenefitPlanService(catalog, sources, sampleRegionService());

  beforeEach(() => {
    catalog = new FakeBenefitCatalog();
    sources = new FakeSourceStateReader();
  });

  describe('cardsToPlan', () => {
    it('그 지역과 아래 지역의 카드 중 아직 정리하지 않은 것만 원문과 함께 준다', async () => {
      catalog.entries = [
        benefitDetails('1', { regionCode: CHUNGBUK }),
        benefitDetails('2', { regionCode: CHEONGJU }),
        benefitDetails('3', { regionCode: CHEONGJU, amount: amountFor('3') }),
        benefitDetails('4', { regionCode: SEJONG }),
      ];
      sources.set(new SourceRef('GOV24', '1'), { 신청기한: '상시' }).set(new SourceRef('GOV24', '2'), {});

      const cards = await service().cardsToPlan(CHUNGBUK);

      expect(cards.map(({ card }) => card.slug)).toEqual(['gov24-1', 'gov24-2']);
      expect(cards[0].sources).toEqual([{ ref: new SourceRef('GOV24', '1'), payload: { 신청기한: '상시' } }]);
    });

    it('수집돼 있지 않은 원본은 payload를 null로 준다', async () => {
      catalog.entries = [benefitDetails('1', { regionCode: CHUNGBUK })];

      expect((await service().cardsToPlan(CHUNGBUK))[0].sources).toEqual([{ ref: new SourceRef('GOV24', '1'), payload: null }]);
    });

    it('정리할 카드가 없으면 빈 목록', async () => {
      catalog.entries = [benefitDetails('4', { regionCode: SEJONG })];

      expect(await service().cardsToPlan(CHUNGBUK)).toEqual([]);
    });
  });

  describe('check', () => {
    it('혜택 목록에 없는 slug와 두 번 나온 slug를 알린다', async () => {
      catalog.entries = [benefitDetails('1')];

      expect(await service().check([planOf('1'), planOf('1'), planOf('9')], '2026')).toEqual([
        { slug: 'gov24-1', problem: '초안에 두 번 이상 있습니다' },
        { slug: 'gov24-9', problem: '혜택 목록에 없는 slug입니다' },
      ]);
    });

    it('카드의 대상 묶음을 보고 검사한다', async () => {
      catalog.entries = [benefitDetails('1', { audience: 'DISABILITY' })];

      expect(await service().check([planOf('1')], '2026')).toEqual([
        { slug: 'gov24-1', problem: '대상 묶음(DISABILITY)이 있는 혜택은 합계 금액(tiers)을 null로 둡니다' },
      ]);
    });

    it('빈 초안은 문제가 없다', async () => {
      expect(await service().check([], '2026')).toEqual([]);
    });
  });

  describe('apply', () => {
    it('초안의 카드만 바꾸고 나머지 카드는 그대로 둔다', async () => {
      catalog.entries = [benefitDetails('1'), benefitDetails('2', { amount: amountFor('2', 300000) })];

      expect(await service().apply([planOf('1')], '2026')).toEqual(['gov24-1']);
      expect(catalog.entries.map((entry) => entry.amount)).toEqual([amountFor('1'), amountFor('2', 300000)]);
    });

    it('null로 적은 필드는 비운다', async () => {
      catalog.entries = [benefitDetails('1', { amount: amountFor('1') })];

      await service().apply([planOf('1', null)], '2026');

      expect(catalog.entries[0].amount).toBeNull();
    });

    it('문제가 하나라도 있으면 아무것도 넣지 않는다', async () => {
      catalog.entries = [benefitDetails('1'), benefitDetails('2', { audience: 'LOW_INCOME' })];

      await expect(service().apply([planOf('1'), planOf('2')], '2026')).rejects.toThrow(CatalogError);
      expect(catalog.entries.every((entry) => entry.amount === null)).toBe(true);
    });
  });
});

describe('BenefitPlanService.quoteProblems', () => {
  const catalog = new FakeBenefitCatalog();
  const sources = new FakeSourceStateReader();
  catalog.entries = [benefitDetails('1'), benefitDetails('2')];
  sources.set(new SourceRef('GOV24', '1'), { 지원내용: '출생아 1인당 500000원 지급', 신청기한: '상시' });
  const service = new BenefitPlanService(catalog, sources, sampleRegionService());

  it('근거 문구가 원문에 있으면 문제가 없다', async () => {
    expect(await service.quoteProblems([planOf('1')])).toEqual([]);
  });

  it('원문에 없는 근거 문구를 알린다', async () => {
    const plan = planOf('1', { ...amountFor('1'), basis: { text: '1인당 300000원', url: 'https://plus.gov.kr/benefit?svcId=1' } });
    expect(await service.quoteProblems([plan])).toEqual([{ slug: 'gov24-1', problem: 'amount: 원문에 없는 인용 "1인당 300000원"' }]);
  });

  it('원문이 수집돼 있지 않으면 모든 인용을 알린다', async () => {
    expect((await service.quoteProblems([planOf('2')])).map((p) => p.slug)).toEqual(['gov24-2']);
  });

  it('혜택 목록에 없는 slug는 건너뛴다 (check가 따로 알린다)', async () => {
    expect(await service.quoteProblems([planOf('9')])).toEqual([]);
  });

  it('근거가 없는 초안(모두 null)은 볼 것이 없다', async () => {
    expect(await service.quoteProblems([planOf('1', null)])).toEqual([]);
  });
});
