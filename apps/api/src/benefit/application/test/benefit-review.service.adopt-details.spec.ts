import { beforeEach, describe, expect, it } from 'vitest';

import { Benefit } from '../../domain/benefit';
import { CurrentSources } from '../../domain/current-sources';
import { SourceRef } from '../../domain/source-ref';
import { BenefitReviewService } from '../benefit-review.service';

import { benefitDetails } from './fakes/benefit-fixtures';
import { FakeSourceStateReader } from './fakes/fake-source-state.reader';
import { InMemoryBenefitRepository } from './fakes/in-memory-benefit.repository';

const at = new Date('2026-11-04T03:00:00Z');
const same = new SourceRef('BOKJIRO_LOCAL', 'SAME');
const modified = new SourceRef('BOKJIRO_LOCAL', 'MODIFIED');
const national = new SourceRef('BOKJIRO_NATIONAL', 'NATIONAL');
const nationalChanged = new SourceRef('BOKJIRO_NATIONAL', 'NATIONAL-CHANGED');
const noDetail = new SourceRef('BOKJIRO_LOCAL', 'NO-DETAIL');
const gov = new SourceRef('GOV24', '1');

const listed = (lastModYmd?: string) => ({ servDgst: '요약', ...(lastModYmd && { lastModYmd }) });

// 상세를 비교하기 전에 확인한 혜택: 확인 기록에 목록만 있다
const verifiedBeforeDetails = (slug: string, refs: SourceRef[], payloadOf: (ref: SourceRef) => Record<string, unknown>) =>
  Benefit.register(benefitDetails(slug, { slug, sources: refs })).verify(
    new CurrentSources(refs.map((ref) => ({ ref, payload: payloadOf(ref), detail: null, removed: false }))),
    at,
  );

const slugs = (items: { slug: string }[]) => items.map((item) => item.slug);

describe('BenefitReviewService.adoptDetails', () => {
  let repo: InMemoryBenefitRepository;
  let reader: FakeSourceStateReader;
  const adopt = () => new BenefitReviewService(repo, reader).adoptDetails();

  beforeEach(() => {
    repo = new InMemoryBenefitRepository([
      verifiedBeforeDetails('same', [same], () => listed('20261001')),
      verifiedBeforeDetails('modified', [modified], () => listed('20261001')),
      verifiedBeforeDetails('national', [national], () => listed()),
      verifiedBeforeDetails('national-changed', [nationalChanged], () => listed()),
      verifiedBeforeDetails('no-detail', [noDetail], () => listed('20261001')),
      verifiedBeforeDetails('gov', [gov], () => ({ 지원내용: 'a' })),
    ]);
    reader = new FakeSourceStateReader()
      .set(same, listed('20261001'))
      .setDetail(same, { alwServCn: 'a', lastModYmd: '20261001' })
      .set(modified, listed('20261105'))
      .setDetail(modified, { alwServCn: 'a', lastModYmd: '20261105' })
      .set(national, listed())
      .setDetail(national, { alwServCn: 'a' })
      .set(nationalChanged, { servDgst: '새 요약' })
      .setDetail(nationalChanged, { alwServCn: 'a' })
      .set(noDetail, listed('20261001'))
      .set(gov, { 지원내용: 'a' });
  });

  it('수정일이 같으면 채우고, 다르면 확인 필요, 수정일이 없으면 목록이 그대로일 때만 가정하고 채운다', async () => {
    const report = await adopt();

    expect(slugs(report.adopted)).toEqual(['same']);
    expect(slugs(report.assumed)).toEqual(['national']);
    expect(slugs(report.needsCheck)).toEqual(['modified', 'national-changed']);
    expect(report.needsCheck.map((item) => item.ref)).toEqual([modified, nationalChanged]);
  });

  it('채운 것만 저장하고 확인일은 그대로 둔다', async () => {
    await adopt();

    const detailOf = (slug: string) => repo.benefits.get(slug)!.verification!.snapshots[0].detail;
    expect(detailOf('same')).toEqual({ alwServCn: 'a', lastModYmd: '20261001' });
    expect(detailOf('national')).toEqual({ alwServCn: 'a' });
    expect(detailOf('modified')).toBeNull();
    expect(detailOf('national-changed')).toBeNull();
    expect(detailOf('no-detail')).toBeNull();
    expect(repo.benefits.get('same')!.verifiedAt).toBe(at);
  });

  it('채우고 나면 상세가 바뀐 것을 원본 바뀜으로 잡는다', async () => {
    await adopt();
    reader.setDetail(same, { alwServCn: 'b', lastModYmd: '20261001' });

    const { items } = await new BenefitReviewService(repo, reader).queue();
    expect(items.find((item) => item.slug === 'same')?.status).toEqual({
      kind: 'SOURCE_CHANGED',
      changes: [{ ref: same, fields: [{ field: '상세.alwServCn', before: 'a', after: 'b' }] }],
    });
  });

  it('다시 실행하면 채운 것은 건너뛰고 확인 필요만 다시 알려준다', async () => {
    await adopt();
    const saveCount = repo.saveCount;
    const again = await adopt();

    expect(again.adopted).toEqual([]);
    expect(again.assumed).toEqual([]);
    expect(slugs(again.needsCheck)).toEqual(['modified', 'national-changed']);
    expect(repo.saveCount).toBe(saveCount);
  });

  it('확인 필요인 혜택도 사람이 다시 확인하면 상세가 채워져 더는 알려주지 않는다', async () => {
    await adopt();
    await new BenefitReviewService(repo, reader).verify(['modified'], new Date('2026-11-10T03:00:00Z'));

    expect(slugs((await adopt()).needsCheck)).toEqual(['national-changed']);
  });

  it('한 혜택의 원본이 여럿이면 원본마다 따로 판단해 채울 수 있는 것만 채운다', async () => {
    repo = new InMemoryBenefitRepository([verifiedBeforeDetails('both', [same, modified], () => listed('20261001'))]);

    const report = await adopt();

    expect(report.adopted).toEqual([{ slug: 'both', ref: same }]);
    expect(report.needsCheck).toEqual([{ slug: 'both', ref: modified }]);
    expect(repo.benefits.get('both')!.verification!.snapshots.map((s) => s.detail !== null)).toEqual([true, false]);
  });

  it('혜택이 없으면 아무것도 저장하지 않는다', async () => {
    repo = new InMemoryBenefitRepository();

    expect(await adopt()).toEqual({ adopted: [], assumed: [], needsCheck: [] });
    expect(repo.saveCount).toBe(0);
  });
});
