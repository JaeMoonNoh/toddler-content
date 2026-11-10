import { beforeEach, describe, expect, it } from 'vitest';

import { SourceDetailService } from '../source-detail.service';

import { FakeDetailFetcher } from './fakes/fake-detail-fetcher';
import { InMemoryDetailRepository } from './fakes/in-memory-detail.repository';
import { RecordingDetailEvents } from './fakes/recording-detail-events';

import type { DetailTarget } from '../detail-refresh-report';

const FIRST_DAY = new Date('2026-11-10T00:00:00Z');
const NEXT_DAY = new Date('2026-11-11T00:00:00Z');

const localDetail = (id: string, extra: Record<string, unknown> = {}) => ({
  resultCode: '0',
  resultMessage: 'SUCCESS',
  servId: id,
  servNm: `혜택 ${id}`,
  sprtTrgtCn: '관내 출산 가정',
  alwServCn: '100만원 지원',
  inqNum: '10',
  lifeNmArray: '임신 · 출산, 영유아',
  ...extra,
});
const local = (externalId: string): DetailTarget => ({ source: 'BOKJIRO_LOCAL', externalId });

describe('SourceDetailService.refresh', () => {
  let repo: InMemoryDetailRepository;
  let events: RecordingDetailEvents;
  let localFetcher: FakeDetailFetcher;
  let nationalFetcher: FakeDetailFetcher;
  let service: SourceDetailService;

  beforeEach(() => {
    repo = new InMemoryDetailRepository();
    events = new RecordingDetailEvents();
    localFetcher = new FakeDetailFetcher('BOKJIRO_LOCAL');
    nationalFetcher = new FakeDetailFetcher('BOKJIRO_NATIONAL');
    service = new SourceDetailService(repo, [localFetcher, nationalFetcher], events);
  });

  it('대상이 없으면 아무것도 받지 않고 빈 보고서를 돌려준다', async () => {
    const report = await service.refresh([], FIRST_DAY);

    expect(report.outcomes).toEqual([]);
    expect(localFetcher.requested).toEqual([]);
    expect(repo.details.size).toBe(0);
  });

  it('처음 받은 상세는 기준점으로 저장하고 변경 내역은 남기지 않는다', async () => {
    localFetcher.reply('A', localDetail('A'));

    const report = await service.refresh([local('A')], FIRST_DAY);

    expect(report.baseline).toEqual([{ source: 'BOKJIRO_LOCAL', externalId: 'A', name: '혜택 A', status: 'baseline' }]);
    expect(repo.details.get('BOKJIRO_LOCAL:A')).toMatchObject({ payload: localDetail('A'), fetchedAt: FIRST_DAY, changedAt: null });
    expect(repo.changes).toEqual([]);
  });

  it('이전과 같으면 받은 시각만 새로 하고 변경 내역은 남기지 않는다', async () => {
    localFetcher.reply('A', localDetail('A'));
    await service.refresh([local('A')], FIRST_DAY);

    const report = await service.refresh([local('A')], NEXT_DAY);

    expect(report.unchanged.map((o) => o.externalId)).toEqual(['A']);
    expect(repo.details.get('BOKJIRO_LOCAL:A')).toMatchObject({ fetchedAt: NEXT_DAY, changedAt: null });
    expect(repo.changes).toEqual([]);
  });

  it('본문이 바뀌면 바뀐 필드를 이전 값·새 값과 함께 남긴다', async () => {
    localFetcher.reply('A', localDetail('A'));
    await service.refresh([local('A')], FIRST_DAY);
    localFetcher.reply('A', localDetail('A', { alwServCn: '200만원 지원' }));

    const report = await service.refresh([local('A')], NEXT_DAY);

    expect(report.changed).toEqual([
      { source: 'BOKJIRO_LOCAL', externalId: 'A', name: '혜택 A', status: 'changed', fields: ['alwServCn'] },
    ]);
    expect(repo.changes).toEqual([
      {
        key: 'BOKJIRO_LOCAL:A',
        changedFields: [{ field: 'alwServCn', before: '100만원 지원', after: '200만원 지원' }],
        detectedAt: NEXT_DAY,
      },
    ]);
    expect(repo.details.get('BOKJIRO_LOCAL:A')).toMatchObject({ payload: { alwServCn: '200만원 지원' }, changedAt: NEXT_DAY });
  });

  it('새로 생긴 필드와 사라진 필드도 변경으로 본다', async () => {
    localFetcher.reply('A', localDetail('A', { slctCritCn: '소득 무관' }));
    await service.refresh([local('A')], FIRST_DAY);
    localFetcher.reply('A', localDetail('A', { aplyMtdCn: '방문 신청' }));

    const report = await service.refresh([local('A')], NEXT_DAY);

    expect(report.changed[0]).toMatchObject({ fields: ['aplyMtdCn', 'slctCritCn'] });
    expect(repo.changes[0].changedFields).toContainEqual({ field: 'slctCritCn', before: '소득 무관', after: null });
  });

  it('조회수, 결과 코드만 바뀌면 바뀌지 않은 것으로 본다', async () => {
    localFetcher.reply('A', localDetail('A'));
    await service.refresh([local('A')], FIRST_DAY);
    localFetcher.reply('A', localDetail('A', { inqNum: '999', resultMessage: 'OK' }));

    const report = await service.refresh([local('A')], NEXT_DAY);

    expect(report.unchanged).toHaveLength(1);
    expect(repo.changes).toEqual([]);
    expect(repo.details.get('BOKJIRO_LOCAL:A')?.payload.inqNum).toBe('999');
  });

  it('순서 없는 목록 필드는 순서만 바뀌면 바뀌지 않은 것으로 본다', async () => {
    localFetcher.reply('A', localDetail('A'));
    await service.refresh([local('A')], FIRST_DAY);
    localFetcher.reply('A', localDetail('A', { lifeNmArray: '영유아, 임신 · 출산' }));

    expect((await service.refresh([local('A')], NEXT_DAY)).unchanged).toHaveLength(1);
  });

  it('반복 목록(문의처 등)의 내용이 바뀌면 변경으로 본다', async () => {
    const contacts = (phone: string) => ({ inqplCtadrList: [{ wlfareInfoDtlCd: '010', wlfareInfoReldCn: phone }] });
    localFetcher.reply('A', localDetail('A', contacts('033-111-1111')));
    await service.refresh([local('A')], FIRST_DAY);
    localFetcher.reply('A', localDetail('A', contacts('033-222-2222')));

    expect((await service.refresh([local('A')], NEXT_DAY)).changed[0]).toMatchObject({ fields: ['inqplCtadrList'] });
  });

  it('한 건이 실패해도 나머지는 받고, 실패는 이유와 함께 보고서에 담는다', async () => {
    localFetcher.reply('A', localDetail('A')).reply('B', new Error('BOKJIRO_LOCAL: 시간 초과')).reply('C', localDetail('C'));

    const report = await service.refresh([local('A'), local('B'), local('C')], FIRST_DAY);

    expect(report.fetched.map((o) => o.externalId)).toEqual(['A', 'C']);
    expect(report.failed).toEqual([{ source: 'BOKJIRO_LOCAL', externalId: 'B', status: 'failed', reason: 'BOKJIRO_LOCAL: 시간 초과' }]);
    expect([...repo.details.keys()]).toEqual(['BOKJIRO_LOCAL:A', 'BOKJIRO_LOCAL:C']);
    expect(events.events).toEqual([
      'baseline BOKJIRO_LOCAL A',
      'failed BOKJIRO_LOCAL B BOKJIRO_LOCAL: 시간 초과',
      'baseline BOKJIRO_LOCAL C',
    ]);
  });

  it('실패한 항목은 이전에 저장한 상세를 그대로 둔다', async () => {
    localFetcher.reply('A', localDetail('A'));
    await service.refresh([local('A')], FIRST_DAY);
    localFetcher.reply('A', new Error('게이트웨이 오류'));

    await service.refresh([local('A')], NEXT_DAY);

    expect(repo.details.get('BOKJIRO_LOCAL:A')).toMatchObject({ payload: localDetail('A'), fetchedAt: FIRST_DAY });
  });

  it('상세를 받을 수 없는 출처는 받지 않고 실패로 담는다', async () => {
    localFetcher.reply('A', localDetail('A'));

    const report = await service.refresh([{ source: 'GOV24', externalId: 'G1' }, local('A')], FIRST_DAY);

    expect(report.failed).toEqual([
      { source: 'GOV24', externalId: 'G1', status: 'failed', reason: '상세를 받을 수 없는 출처입니다 (GOV24)' },
    ]);
    expect(report.baseline).toHaveLength(1);
  });

  it('같은 원본이 여러 번 있어도 한 번만 받는다', async () => {
    localFetcher.reply('A', localDetail('A'));

    const report = await service.refresh([local('A'), local('A')], FIRST_DAY);

    expect(localFetcher.requested).toEqual(['A']);
    expect(report.outcomes).toHaveLength(1);
  });

  it('출처마다 맞는 fetcher로 받고, 같은 ID라도 출처가 다르면 따로 저장한다', async () => {
    localFetcher.reply('A', localDetail('A'));
    nationalFetcher.reply('A', { servId: 'A', servNm: '중앙 A', tgtrDtlCn: '전 국민' });

    await service.refresh([local('A'), { source: 'BOKJIRO_NATIONAL', externalId: 'A' }], FIRST_DAY);

    expect(nationalFetcher.requested).toEqual(['A']);
    expect([...repo.details.keys()]).toEqual(['BOKJIRO_LOCAL:A', 'BOKJIRO_NATIONAL:A']);
  });

  it('상세를 받을 수 있는 출처를 알려준다', () => {
    expect(service.detailSources).toEqual(['BOKJIRO_LOCAL', 'BOKJIRO_NATIONAL']);
  });
});
