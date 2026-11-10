import { describe, expect, it } from 'vitest';

import { SourceRef } from '../../../benefit/domain/source-ref';
import { CollectionReport } from '../../../collect/application/collection-report';
import { DetailRefreshReport } from '../../../collect/application/detail-refresh-report';
import { ReportPrinter } from '../../../collect/infrastructure/cli/report-printer';
import { DailyCheckPrinter } from '../daily-check-printer';

import type { ReviewItem, ReviewQueue } from '../../../benefit/application/benefit-review.service';
import type { DailyCheckResult } from '../../application/daily-check.service';

const at = new Date('2026-11-02T19:00:00Z');
const gov = new SourceRef('GOV24', '135200000120');
const zero = { VERIFIED: 0, UNVERIFIED: 0, SOURCE_CHANGED: 0, SOURCE_REMOVED: 0, SOURCE_MISSING: 0 };
const queue = (items: ReviewItem[], counts: Partial<ReviewQueue['counts']>): ReviewQueue => ({ items, counts: { ...zero, ...counts } });
const noDetails: DailyCheckResult['details'] = { status: 'succeeded', report: new DetailRefreshReport([]) };
const result = (
  review: DailyCheckResult['review'],
  collection = new CollectionReport([]),
  details: DailyCheckResult['details'] = noDetails,
): DailyCheckResult => ({ collection, details, review });
const quietReview: DailyCheckResult['review'] = { status: 'succeeded', queue: queue([], {}) };
const detailReport = new DetailRefreshReport(
  [
    { source: 'BOKJIRO_LOCAL', externalId: 'A', name: '출산축하금', status: 'unchanged' },
    { source: 'BOKJIRO_NATIONAL', externalId: 'C', name: '첫만남이용권', status: 'changed', fields: ['alwServCn', 'tgtrDtlCn'] },
    { source: 'BOKJIRO_LOCAL', externalId: 'D', status: 'failed', reason: 'BOKJIRO_LOCAL: 시간 초과' },
  ],
  { upToDate: 955, unlisted: 1 },
);
const changed = (name: string, fields: string[]): ReviewItem => ({
  slug: name,
  name,
  verifiedAt: at,
  status: { kind: 'SOURCE_CHANGED', changes: [{ ref: gov, fields: fields.map((field) => ({ field, before: 'a', after: 'b' })) }] },
});
const unverified = (name: string): ReviewItem => ({ slug: name, name, verifiedAt: null, status: { kind: 'UNVERIFIED' } });

const printer = new DailyCheckPrinter(new ReportPrinter(), 2);

describe('DailyCheckPrinter', () => {
  it('수집 보고서 아래에 검토 요약을 붙인다', () => {
    const text = printer.print(result({ status: 'succeeded', queue: queue([unverified('a')], { UNVERIFIED: 104 }) }), at);
    expect(text).toMatch(/^수집 결과 \(2026-11-03 04:00\)/);
    expect(text.split('\n').at(-1)).toBe('혜택 검토: 확인 필요 없음 (검증 전 104건)');
  });

  it('원본이 바뀐 혜택은 이름과 바뀐 필드를 보여주고, 검증 전은 건수만 센다', () => {
    const text = printer.print(
      result({
        status: 'succeeded',
        queue: queue([changed('아동수당', ['지원내용', '신청기한']), unverified('가'), unverified('나')], {
          SOURCE_CHANGED: 1,
          UNVERIFIED: 2,
        }),
      }),
      at,
    );
    expect(text).toContain(
      [
        '⚠ 혜택 검토: 확인 필요 1건 (원본 바뀜 1 · 원본 사라짐 0 · 원본 없음 0), 검증 전 2건',
        '    원본 바뀜  아동수당 (지원내용, 신청기한)',
        '자세히 보기: pnpm benefit review',
      ].join('\n'),
    );
    expect(text).not.toContain('    확인 전');
  });

  it('원본이 둘인 혜택에서 같은 필드가 바뀌면 한 번만 적는다', () => {
    const item: ReviewItem = {
      ...changed('부모급여', []),
      status: {
        kind: 'SOURCE_CHANGED',
        changes: [
          { ref: gov, fields: [{ field: 'servDgst', before: 1, after: 2 }] },
          { ref: new SourceRef('BOKJIRO_NATIONAL', 'WLF00004657'), fields: [{ field: 'servDgst', before: 1, after: 2 }] },
        ],
      },
    };
    expect(printer.print(result({ status: 'succeeded', queue: queue([item], { SOURCE_CHANGED: 1 }) }), at)).toContain(
      '부모급여 (servDgst)',
    );
  });

  it('사라진 원본은 필드 없이 이름만', () => {
    const removed: ReviewItem = { slug: 's', name: '셋째 자녀 지원금', verifiedAt: null, status: { kind: 'SOURCE_REMOVED', refs: [gov] } };
    expect(printer.print(result({ status: 'succeeded', queue: queue([removed], { SOURCE_REMOVED: 1 }) }), at)).toContain(
      '    원본 사라짐  셋째 자녀 지원금\n',
    );
  });

  it('많으면 정해진 수만 보여주고 나머지는 건수로', () => {
    const items = ['가', '나', '다'].map((name) => changed(name, ['f']));
    const text = printer.print(result({ status: 'succeeded', queue: queue(items, { SOURCE_CHANGED: 3 }) }), at);
    expect(text).toContain('    원본 바뀜  나 (f)\n    … 외 1건');
    expect(text).not.toContain('다 (f)');
  });

  it('검토에 실패하면 이유를 보여준다', () => {
    expect(
      printer
        .print(result({ status: 'failed', reason: 'DB 연결 끊김' }), at)
        .split('\n')
        .at(-1),
    ).toBe('✘ 혜택 검토 실패: DB 연결 끊김');
  });

  it('바뀐 상세가 없으면 건수만 한 줄로', () => {
    const report = new DetailRefreshReport([{ source: 'BOKJIRO_LOCAL', externalId: 'A', name: '출산축하금', status: 'unchanged' }], {
      upToDate: 958,
      unlisted: 0,
    });
    const text = printer.print(result(quietReview, undefined, { status: 'succeeded', report }), at);
    expect(text).toContain('\n상세 확인: 다시 받음 1건 (변경 0 · 실패 0), 건너뜀 958건: 바뀌지 않았을 것 958 · 목록에 없음 0\n');
  });

  it('바뀐 상세는 바뀐 필드와 함께, 받지 못한 상세는 이유와 함께 보여준다', () => {
    const text = printer.print(result(quietReview, undefined, { status: 'succeeded', report: detailReport }), at);
    expect(text).toContain(
      [
        '⚠ 상세 확인: 다시 받음 3건 (변경 1 · 실패 1), 건너뜀 956건: 바뀌지 않았을 것 955 · 목록에 없음 1',
        '  바뀐 상세',
        '    복지로 중앙부처  첫만남이용권 (C): alwServCn, tgtrDtlCn',
        '  받지 못한 상세',
        '    복지로 지자체  D: BOKJIRO_LOCAL: 시간 초과',
        '',
        '혜택 검토',
      ].join('\n'),
    );
  });

  it('바뀐 상세가 많으면 정해진 수만 보여주고 나머지는 건수로', () => {
    const report = new DetailRefreshReport(
      ['가', '나', '다'].map((name) => ({
        source: 'BOKJIRO_LOCAL' as const,
        externalId: name,
        name,
        status: 'changed' as const,
        fields: ['f'],
      })),
    );
    const text = printer.print(result(quietReview, undefined, { status: 'succeeded', report }), at);
    expect(text).toContain('    복지로 지자체  나 (나): f\n    … 외 1건');
  });

  it('상세 확인에 실패하면 이유를 보여준다', () => {
    const text = printer.print(result(quietReview, undefined, { status: 'failed', reason: '혜택 목록 파일을 읽지 못했습니다' }), at);
    expect(text).toContain('\n✘ 상세 확인 실패: 혜택 목록 파일을 읽지 못했습니다\n');
  });

  describe('summaryLine', () => {
    it('출처 수, 실패 수, 변경 수, 확인 필요 수를 한 줄로', () => {
      const collection = new CollectionReport([
        { source: 'GOV24', status: 'failed', reason: '시간 초과' },
        { source: 'BOKJIRO_LOCAL', status: 'failed', reason: '인증키 오류' },
      ]);
      const line = printer.summaryLine(
        result({ status: 'succeeded', queue: queue([changed('부모급여', ['지원내용'])], { SOURCE_CHANGED: 1 }) }, collection),
      );
      expect(line).toBe(
        'Daily check finished: sources=2 failed=2 changes=0 details=refetched:0,skipped:0,changed:0,failed:0 review=ok attention=1',
      );
    });

    it('검증 전 혜택은 확인 필요 수에 넣지 않는다', () => {
      const line = printer.summaryLine(result({ status: 'succeeded', queue: queue([unverified('a')], { UNVERIFIED: 1 }) }));
      expect(line).toBe(
        'Daily check finished: sources=0 failed=0 changes=0 details=refetched:0,skipped:0,changed:0,failed:0 review=ok attention=0',
      );
    });

    it('상세는 다시 받은 수, 건너뛴 수, 변경 수, 실패 수를 담는다', () => {
      expect(printer.summaryLine(result(quietReview, undefined, { status: 'succeeded', report: detailReport }))).toBe(
        'Daily check finished: sources=0 failed=0 changes=0 details=refetched:3,skipped:955,changed:1,failed:1 review=ok attention=0',
      );
    });

    it('상세 확인에 실패하면 details=failed', () => {
      expect(printer.summaryLine(result(quietReview, undefined, { status: 'failed', reason: 'x' }))).toContain(' details=failed review=ok');
    });

    it('검토에 실패하면 review=failed', () => {
      expect(printer.summaryLine(result({ status: 'failed', reason: 'DB 연결 끊김' }))).toBe(
        'Daily check finished: sources=0 failed=0 changes=0 details=refetched:0,skipped:0,changed:0,failed:0 review=failed',
      );
    });
  });
});
