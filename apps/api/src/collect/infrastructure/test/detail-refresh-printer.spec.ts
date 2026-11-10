import { describe, expect, it } from 'vitest';

import { DetailRefreshReport } from '../../application/detail-refresh-report';
import { printDetailRefresh } from '../cli/detail-refresh-printer';

const at = new Date('2026-11-10T04:00:00Z'); // 한국 시각 11월 10일 13:00

describe('printDetailRefresh', () => {
  it('대상이 없으면 0건으로 알려준다', () => {
    expect(printDetailRefresh(new DetailRefreshReport([]), at)).toBe(
      ['상세 받기 결과 (2026-11-10 13:00)', '대상 0건: 받음 0 (처음 받음 0 · 그대로 0 · 변경 0) · 실패 0'].join('\n'),
    );
  });

  it('바뀐 항목은 바뀐 필드와 함께, 실패는 이유와 함께 모두 보여준다', () => {
    const report = new DetailRefreshReport([
      { source: 'BOKJIRO_LOCAL', externalId: 'A', name: '출산축하금', status: 'baseline' },
      { source: 'BOKJIRO_LOCAL', externalId: 'B', name: '산후조리비', status: 'unchanged' },
      { source: 'BOKJIRO_NATIONAL', externalId: 'C', name: '첫만남이용권', status: 'changed', fields: ['alwServCn', 'tgtrDtlCn'] },
      { source: 'BOKJIRO_LOCAL', externalId: 'D', status: 'failed', reason: 'BOKJIRO_LOCAL: 시간 초과' },
    ]);

    expect(printDetailRefresh(report, at).split('\n').slice(1)).toEqual([
      '대상 4건: 받음 3 (처음 받음 1 · 그대로 1 · 변경 1) · 실패 1',
      '변경',
      '    복지로 중앙부처  첫만남이용권 (C): alwServCn, tgtrDtlCn',
      '실패',
      '    복지로 지자체  D: BOKJIRO_LOCAL: 시간 초과',
    ]);
  });
});
