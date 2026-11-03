import { describe, expect, it } from 'vitest';
import type { ReviewItem, ReviewQueue } from '../../../benefit/application/benefit-review.service';
import { SourceRef } from '../../../benefit/domain/source-ref';
import { CollectionReport } from '../../../collect/application/collection-report';
import { ReportPrinter } from '../../../collect/infrastructure/cli/report-printer';
import type { DailyCheckResult } from '../../application/daily-check.service';
import { DailyCheckPrinter } from '../daily-check-printer';

const at = new Date('2026-11-02T19:00:00Z');
const gov = new SourceRef('GOV24', '135200000120');
const zero = { VERIFIED: 0, UNVERIFIED: 0, SOURCE_CHANGED: 0, SOURCE_REMOVED: 0, SOURCE_MISSING: 0 };
const queue = (items: ReviewItem[], counts: Partial<ReviewQueue['counts']>): ReviewQueue => ({ items, counts: { ...zero, ...counts } });
const result = (review: DailyCheckResult['review'], collection = new CollectionReport([])): DailyCheckResult => ({ collection, review });
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
        queue: queue([changed('아동수당', ['지원내용', '신청기한']), unverified('가'), unverified('나')], { SOURCE_CHANGED: 1, UNVERIFIED: 2 }),
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
    expect(printer.print(result({ status: 'succeeded', queue: queue([item], { SOURCE_CHANGED: 1 }) }), at)).toContain('부모급여 (servDgst)');
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
    expect(printer.print(result({ status: 'failed', reason: 'DB 연결 끊김' }), at).split('\n').at(-1)).toBe('✘ 혜택 검토 실패: DB 연결 끊김');
  });
});
