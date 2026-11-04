import { beforeEach, describe, expect, it } from 'vitest';

import { CollectService } from '../../../collect/application/collect.service';
import { InMemorySnapshotRepository } from '../../../collect/application/test/fakes/in-memory-snapshot.repository';
import { RecordingCollectionEvents } from '../../../collect/application/test/fakes/recording-collection-events';
import { sampleRegionService } from '../../../region/application/test/fakes/sample-region-service';
import { SourceRef } from '../../domain/source-ref';
import { BenefitCandidateService } from '../benefit-candidate.service';
import { CatalogError } from '../benefit-catalog.service';

import { benefitDetails } from './fakes/benefit-fixtures';
import { FakeBenefitCatalog } from './fakes/fake-benefit-catalog';
import { FakeSourceStateReader } from './fakes/fake-source-state.reader';

import type { SourceId } from '../../../shared/domain/source-id';

const CHUNGBUK = '4300000000';
const CHEONGJU = '4311000000';

const gov24 = (id: string, name: string, agency: string, type = '시군구', extra: Record<string, unknown> = {}) => ({
  source: 'GOV24' as SourceId,
  externalId: id,
  payload: {
    서비스ID: id,
    서비스명: name,
    소관기관명: agency,
    소관기관유형: type,
    서비스목적요약: `${name} 요약`,
    상세조회URL: `https://plus.gov.kr/${id}`,
    ...extra,
  },
});
const bokjiro = (id: string, name: string, ctpvNm: string, sggNm: string, extra: Record<string, unknown> = {}) => ({
  source: 'BOKJIRO_LOCAL' as SourceId,
  externalId: id,
  payload: { servId: id, servNm: name, ctpvNm, sggNm, servDgst: `${name} 설명`, servDtlLink: `https://bokjiro.go.kr/${id}`, ...extra },
});

describe('BenefitCandidateService', () => {
  let repo: InMemorySnapshotRepository;
  let catalog: FakeBenefitCatalog;
  let sources: FakeSourceStateReader;
  const seed = (...items: { source: SourceId; externalId: string; payload: Record<string, unknown> }[]) =>
    items.forEach(({ source, externalId, payload }, i) => {
      repo.items.set(`${source}:${externalId}`, { source, externalId, name: String(i), payload, removed: false });
      sources.set(new SourceRef(source, externalId), payload);
    });
  const service = () =>
    new BenefitCandidateService(catalog, new CollectService(repo, [], new RecordingCollectionEvents()), sampleRegionService(), sources);
  const candidatesFor = (code: string) => service().candidatesFor(code);

  beforeEach(() => {
    repo = new InMemorySnapshotRepository();
    catalog = new FakeBenefitCatalog();
    sources = new FakeSourceStateReader();
  });

  it('고른 지역과 아래 지역의 지자체 혜택을 지역 순서, 신뢰도, 이름순으로', async () => {
    seed(
      gov24('C2', '청주 다자녀 양육 지원', '충청북도 청주시'),
      gov24('B1', '임산부 교통비 지원', '충청북도', '광역시도'),
      gov24('C1', '청주 산후조리비 지원', '충청북도 청주시'),
    );
    const list = await candidatesFor(CHUNGBUK);

    expect(list.regions.map((r) => r.fullName)).toEqual(['충청북도', '충청북도 청주시', '충청북도 청주시 상당구']);
    expect(list.candidates.map((c) => [c.regionCode, c.name, c.strength])).toEqual([
      [CHUNGBUK, '임산부 교통비 지원', 'strong'],
      [CHEONGJU, '청주 산후조리비 지원', 'strong'],
      [CHEONGJU, '청주 다자녀 양육 지원', 'possible'],
    ]);
  });

  it('시·군을 고르면 위 지역(도) 혜택은 넣지 않는다', async () => {
    seed(gov24('B1', '임산부 교통비 지원', '충청북도', '광역시도'), gov24('C1', '산후조리비 지원', '충청북도 청주시'));
    expect((await candidatesFor(CHEONGJU)).candidates.map((c) => c.name)).toEqual(['산후조리비 지원']);
  });

  it('중앙부처·공공기관 혜택은 지역 후보가 아니다', async () => {
    seed(gov24('N1', '출산 지원', '충청북도', '중앙행정기관'), gov24('N2', '출산 지원', '충청북도 청주시', '공공기관'));
    expect((await candidatesFor(CHUNGBUK)).candidates).toEqual([]);
  });

  it('이미 혜택 목록에 있는 원본과 관련 없는 혜택은 뺀다', async () => {
    seed(gov24('C1', '산후조리비 지원', '충청북도 청주시'), gov24('C2', '경로당 운영', '충청북도 청주시'));
    catalog.entries = [benefitDetails('x', { sources: [new SourceRef('GOV24', 'C1')] })];
    expect((await candidatesFor(CHEONGJU)).candidates).toEqual([]);
  });

  it('지역 목록에 없는 기관 이름이면 뺀다', async () => {
    seed(gov24('X1', '출산 지원', '충청북도 없는시'));
    expect((await candidatesFor(CHUNGBUK)).candidates).toEqual([]);
  });

  it('출처에서 사라진 원본은 뺀다', async () => {
    seed(gov24('C1', '산후조리비 지원', '충청북도 청주시'));
    repo.items.get('GOV24:C1')!.removed = true;
    expect((await candidatesFor(CHEONGJU)).candidates).toEqual([]);
  });

  it('복지로 지자체는 시·도와 시·군·구 이름으로 지역을 찾고 생애주기를 본다', async () => {
    seed(
      bokjiro('W1', '다자녀 가정 양육비', '충청북도', '청주시', {
        lifeNmArray: '임신 · 출산, 영유아',
        bizChrDeptNm: '충청북도 청주시 여성가족과',
      }),
      bokjiro('W2', '도민 출산 축하', '충청북도', ''),
    );
    const list = await candidatesFor(CHUNGBUK);

    expect(list.candidates.map((c) => [c.regionCode, c.name, c.strength, c.agency, c.suggestedSlug])).toEqual([
      [CHUNGBUK, '도민 출산 축하', 'strong', '충청북도', 'bokjiro-w2'],
      [CHEONGJU, '다자녀 가정 양육비', 'strong', '충청북도 청주시 여성가족과', 'bokjiro-w1'],
    ]);
  });

  it('같은 지역에 같은 이름으로 두 출처에 있으면 보조금24를 대표로 한 줄로 합친다', async () => {
    seed(bokjiro('W1', '청주시 산후조리비 지원사업', '충청북도', '청주시'), gov24('C1', '산후조리비 지원', '충청북도 청주시'));
    const [candidate, ...rest] = (await candidatesFor(CHEONGJU)).candidates;

    expect(rest).toEqual([]);
    expect(candidate.sources.map((ref) => ref.key)).toEqual(['GOV24:C1', 'BOKJIRO_LOCAL:W1']);
    expect(candidate.suggestedSlug).toBe('gov24-c1');
  });

  it('이름이 같아도 지역이 다르면 합치지 않는다', async () => {
    seed(gov24('B1', '산후조리비 지원', '충청북도', '광역시도'), gov24('C1', '산후조리비 지원', '충청북도 청주시'));
    expect((await candidatesFor(CHUNGBUK)).candidates).toHaveLength(2);
  });

  it('후보가 없는 지역도 지역 목록에는 남긴다', async () => {
    const list = await candidatesFor(CHUNGBUK);
    expect(list.candidates).toEqual([]);
    expect(list.regions).toHaveLength(3);
  });

  describe('add', () => {
    it('고른 후보를 지역 머리말을 뗀 이름과 신청 방법 초안을 붙여 목록 끝에 넣는다', async () => {
      catalog.entries = [benefitDetails('0')];
      seed(gov24('C1', '(청주시) 산후조리비 지원', '충청북도 청주시', '시군구', { 신청방법: '방문신청', 전화문의: '청주시/043-201-1111' }));

      const [card] = await service().add(CHUNGBUK, [{ slug: 'gov24-c1' }]);

      expect(card).toMatchObject({
        slug: 'gov24-c1',
        name: '산후조리비 지원',
        regionCode: CHEONGJU,
        sourceUrl: 'https://plus.gov.kr/C1',
        schedule: null,
        amount: null,
        audience: null,
        conditions: [],
        howToApply: { summary: '방문 · 문의 043-201-1111' },
      });
      expect(catalog.entries.map((e) => e.slug)).toEqual(['gov24-0', 'gov24-c1']);
    });

    it('같은 이름으로 묶인 원본과 merge로 합친 후보의 원본을 모두 붙인다', async () => {
      seed(
        gov24('C1', '산후조리비 지원', '충청북도 청주시'),
        bokjiro('W1', '산후조리비 지원', '충청북도', '청주시'),
        gov24('C2', '산후조리 비용 지원(상당구 보건소)', '충청북도 청주시'),
      );

      const [card] = await service().add(CHUNGBUK, [{ slug: 'gov24-c1', merge: ['gov24-c2'] }]);

      expect(card.sources.map((ref) => ref.key)).toEqual(['GOV24:C1', 'BOKJIRO_LOCAL:W1', 'GOV24:C2']);
    });

    it('이름, 대상 묶음, 조건을 판단대로 넣는다', async () => {
      seed(gov24('C1', '다자녀 양육비', '충청북도 청주시'));

      const [card] = await service().add(CHUNGBUK, [
        { slug: 'gov24-c1', name: '셋째 양육비', audience: 'MULTI_CHILD', conditions: ['HOME_CARE'] },
      ]);

      expect(card).toMatchObject({ name: '셋째 양육비', audience: 'MULTI_CHILD', conditions: ['HOME_CARE'] });
    });

    it('후보에 없는 slug나 두 번 나온 slug가 있으면 아무것도 넣지 않는다', async () => {
      seed(gov24('C1', '산후조리비 지원', '충청북도 청주시'), gov24('C2', '출산축하금', '충청북도 청주시'));

      await expect(
        service().add(CHUNGBUK, [{ slug: 'gov24-c1', merge: ['gov24-c2'] }, { slug: 'gov24-c2' }, { slug: 'gov24-zz' }]),
      ).rejects.toThrow(/gov24-zz: 이 지역 후보에 없습니다[\s\S]*gov24-c2: 판단에 두 번 이상 나옵니다/);
      expect(catalog.entries).toEqual([]);
    });

    it('이미 목록에 있는 원본은 후보가 아니라서 넣지 않는다', async () => {
      seed(gov24('C1', '산후조리비 지원', '충청북도 청주시'));
      catalog.entries = [benefitDetails('C1', { slug: 'gov24-c1', sources: [new SourceRef('GOV24', 'C1')] })];

      await expect(service().add(CHUNGBUK, [{ slug: 'gov24-c1' }])).rejects.toThrow(CatalogError);
    });

    it('카드 규칙에 어긋나면(알 수 없는 대상 묶음 등) 아무것도 넣지 않는다', async () => {
      seed(gov24('C1', '산후조리비 지원', '충청북도 청주시'));

      await expect(service().add(CHUNGBUK, [{ slug: 'gov24-c1', audience: 'NOBODY' as never }])).rejects.toThrow('알 수 없는 대상 묶음');
      expect(catalog.entries).toEqual([]);
    });

    it('빈 판단이면 아무것도 넣지 않는다', async () => {
      expect(await service().add(CHUNGBUK, [])).toEqual([]);
    });
  });
});
