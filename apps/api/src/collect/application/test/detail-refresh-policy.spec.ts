import { describe, expect, it } from 'vitest';

import { detailKeyOf, type KnownDetails, planDetailRefresh } from '../policies/detail-refresh-policy';

import type { DetailSourceId } from '../../../shared/domain/source-id';
import type { StoredItem } from '../../domain/source-record';
import type { DetailTarget } from '../detail-refresh-report';
import type { StoredDetail } from '../ports/detail.repository';

// 한국 시각 2026-11-10 04:00
const NOW = new Date('2026-11-09T19:00:00Z');
const kst = (iso: string) => new Date(`${iso}+09:00`);

const local = (externalId: string): DetailTarget => ({ source: 'BOKJIRO_LOCAL', externalId });
const national = (externalId: string): DetailTarget => ({ source: 'BOKJIRO_NATIONAL', externalId });

const listItem = (target: DetailTarget, payload: Record<string, unknown> = {}, removed = false) =>
  [detailKeyOf(target), { externalId: target.externalId, name: target.externalId, payload, removed }] as const;
const stored = (target: DetailTarget, fetchedAt: Date, payload: Record<string, unknown> = {}) =>
  [detailKeyOf(target), { ...target, payload, fetchedAt }] as const;

const known = (
  listed: (readonly [string, StoredItem])[],
  details: (readonly [string, StoredDetail])[],
  detailSources: DetailSourceId[] = ['BOKJIRO_LOCAL', 'BOKJIRO_NATIONAL'],
): KnownDetails => ({ detailSources, listed: new Map(listed), stored: new Map(details) });

describe('planDetailRefresh', () => {
  it('지켜볼 원본이 없으면 아무것도 받지 않는다', () => {
    expect(planDetailRefresh([], known([], []), NOW)).toEqual({ due: [], upToDate: [], unlisted: [] });
  });

  it('상세를 한 번도 받지 않았으면 받는다', () => {
    const plan = planDetailRefresh([local('A'), national('N')], known([listItem(local('A')), listItem(national('N'))], []), NOW);

    expect(plan.due).toEqual([local('A'), national('N')]);
  });

  it('지자체: 목록의 수정일이 받은 상세의 수정일과 같으면 받지 않는다', () => {
    const plan = planDetailRefresh(
      [local('A')],
      known([listItem(local('A'), { lastModYmd: '20261002' })], [stored(local('A'), kst('2026-10-01T04:00'), { lastModYmd: '20261002' })]),
      NOW,
    );

    expect(plan).toEqual({ due: [], upToDate: [local('A')], unlisted: [] });
  });

  it('지자체: 목록의 수정일이 바뀌었으면 어제 받았어도 다시 받는다', () => {
    const plan = planDetailRefresh(
      [local('A')],
      known([listItem(local('A'), { lastModYmd: '20261109' })], [stored(local('A'), kst('2026-11-09T04:00'), { lastModYmd: '20261002' })]),
      NOW,
    );

    expect(plan.due).toEqual([local('A')]);
  });

  it('지자체: 수정일이 한쪽에라도 없으면 받은 지 며칠 됐는지로 정한다', () => {
    const plan = planDetailRefresh(
      [local('A'), local('B'), local('C')],
      known(
        [listItem(local('A')), listItem(local('B'), { lastModYmd: '20261002' }), listItem(local('C'), { lastModYmd: '' })],
        [
          stored(local('A'), kst('2026-11-03T04:00'), { lastModYmd: '20261002' }),
          stored(local('B'), kst('2026-11-04T04:00')),
          stored(local('C'), kst('2026-11-09T04:00'), { lastModYmd: '20261002' }),
        ],
      ),
      NOW,
    );

    expect(plan.due).toEqual([local('A')]);
    expect(plan.upToDate).toEqual([local('B'), local('C')]);
  });

  it('중앙부처: 목록에 수정일이 없어 받은 지 7일이 되면 다시 받고, 6일이면 그대로 둔다', () => {
    const plan = planDetailRefresh(
      [national('SEVEN'), national('SIX')],
      known(
        [listItem(national('SEVEN')), listItem(national('SIX'))],
        [stored(national('SEVEN'), kst('2026-11-03T04:00')), stored(national('SIX'), kst('2026-11-04T04:00'))],
      ),
      NOW,
    );

    expect(plan.due).toEqual([national('SEVEN')]);
    expect(plan.upToDate).toEqual([national('SIX')]);
  });

  it('중앙부처: 받은 시각보다 몇 분 일찍 돌아도 날짜로 7일이면 다시 받는다', () => {
    const plan = planDetailRefresh(
      [national('N')],
      known([listItem(national('N'))], [stored(national('N'), kst('2026-11-03T04:05'))]),
      kst('2026-11-10T04:00'),
    );

    expect(plan.due).toEqual([national('N')]);
  });

  it('출처 목록에서 사라졌거나 목록에 없는 원본은 받지 않는다', () => {
    const plan = planDetailRefresh(
      [local('GONE'), local('NEVER')],
      known([listItem(local('GONE'), {}, true)], [stored(local('GONE'), kst('2026-01-01T04:00'))]),
      NOW,
    );

    expect(plan).toEqual({ due: [], upToDate: [], unlisted: [local('GONE'), local('NEVER')] });
  });

  it('상세를 받을 수 없는 출처(보조금24)는 어디에도 넣지 않는다', () => {
    const gov24: DetailTarget = { source: 'GOV24', externalId: 'G1' };

    const plan = planDetailRefresh([gov24, local('A')], known([listItem(gov24), listItem(local('A'))], []), NOW);

    expect(plan).toEqual({ due: [local('A')], upToDate: [], unlisted: [] });
  });
});
