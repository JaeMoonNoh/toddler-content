import { describe, expect, it } from 'vitest';

import { CollectionReport } from '../../application/collection-report';
import { ReportPrinter } from '../cli/report-printer';

import type { CollectSourceResult } from '../../application/collect.service';

const at = new Date('2026-11-02T19:00:00Z'); // 한국 시각 11월 3일 04:00

const result = (overrides: Partial<CollectSourceResult>): CollectSourceResult => ({
  source: 'GOV24',
  runId: 'r1',
  baseline: false,
  itemCount: 10942,
  added: 0,
  updated: 0,
  removed: 0,
  duplicateIds: [],
  changes: [],
  ...overrides,
});

describe('ReportPrinter', () => {
  it('한국 시각으로 제목을 쓴다', () => {
    const text = new ReportPrinter().print(new CollectionReport([]), at);
    expect(text.split('\n')[0]).toBe('수집 결과 (2026-11-03 04:00)');
  });

  it('출처가 없으면 그렇다고 알려준다', () => {
    expect(new ReportPrinter().print(new CollectionReport([]), at)).toContain('수집할 출처가 없습니다.');
  });

  it('첫 수집은 기준점만 저장했다고 쓴다', () => {
    const report = new CollectionReport([{ source: 'GOV24', status: 'succeeded', result: result({ baseline: true, added: 10942 }) }]);
    expect(new ReportPrinter().print(report, at)).toContain('✔ 보조금24 10,942건, 첫 수집이라 기준점만 저장');
  });

  it('바뀐 항목을 이름과 바뀐 필드로 보여준다', () => {
    const report = new CollectionReport([
      {
        source: 'BOKJIRO_NATIONAL',
        status: 'succeeded',
        result: result({
          source: 'BOKJIRO_NATIONAL',
          itemCount: 461,
          added: 1,
          updated: 1,
          changes: [
            { type: 'ADDED', externalId: 'W1', name: '새 혜택', fields: [] },
            { type: 'UPDATED', externalId: 'W2', name: '부모급여 지원', fields: ['servDgst', 'sprtCycNm'] },
          ],
        }),
      },
    ]);

    expect(new ReportPrinter().print(report, at).split('\n').slice(1)).toEqual([
      '✔ 복지로 중앙부처 461건, 추가 1 · 변경 1 · 삭제 0',
      '    추가  새 혜택',
      '    변경  부모급여 지원 (servDgst, sprtCycNm)',
      '전체 변경 2건',
    ]);
  });

  it('이름이 비어 있으면 ID로 보여준다', () => {
    const report = new CollectionReport([
      {
        source: 'GOV24',
        status: 'succeeded',
        result: result({ removed: 1, changes: [{ type: 'REMOVED', externalId: 'X9', name: '', fields: [] }] }),
      },
    ]);
    expect(new ReportPrinter().print(report, at)).toContain('    삭제  X9');
  });

  it('변경이 많으면 일부만 보여주고 나머지 건수를 쓴다', () => {
    const changes = Array.from({ length: 5 }, (_, i) => ({ type: 'ADDED' as const, externalId: String(i), name: `혜택 ${i}`, fields: [] }));
    const report = new CollectionReport([{ source: 'GOV24', status: 'succeeded', result: result({ added: 5, changes }) }]);

    const text = new ReportPrinter(2).print(report, at);

    expect(text).toContain('혜택 1');
    expect(text).not.toContain('혜택 2');
    expect(text).toContain('… 외 3건');
  });

  it('딱 최대 개수만큼이면 "외 N건"을 쓰지 않는다', () => {
    const changes = Array.from({ length: 2 }, (_, i) => ({ type: 'ADDED' as const, externalId: String(i), name: `혜택 ${i}`, fields: [] }));
    const report = new CollectionReport([{ source: 'GOV24', status: 'succeeded', result: result({ added: 2, changes }) }]);
    expect(new ReportPrinter(2).print(report, at)).not.toContain('외');
  });

  it('실패한 출처는 이유와 함께 쓰고, 요약에 실패 수를 넣는다', () => {
    const report = new CollectionReport([
      { source: 'BOKJIRO_LOCAL', status: 'failed', reason: 'LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR' },
      { source: 'GOV24', status: 'succeeded', result: result({}) },
    ]);
    const text = new ReportPrinter().print(report, at);

    expect(text).toContain('✘ 복지로 지자체 실패: LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR');
    expect(text.split('\n').at(-1)).toBe('실패한 출처 1곳, 전체 변경 0건');
  });
});
