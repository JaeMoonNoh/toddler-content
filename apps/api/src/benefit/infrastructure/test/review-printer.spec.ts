import { describe, expect, it } from 'vitest';

import { SourceRef } from '../../domain/source-ref';
import { ReviewPrinter } from '../cli/review-printer';

import type { ReviewItem, ReviewQueue } from '../../application/benefit-review.service';

const printer = new ReviewPrinter();
const verifiedAt = new Date('2026-11-01T16:00:00Z'); // 한국 시각 11월 2일 01:00
const gov = new SourceRef('GOV24', '571000000116');
const zero = { VERIFIED: 0, UNVERIFIED: 0, SOURCE_CHANGED: 0, SOURCE_REMOVED: 0, SOURCE_MISSING: 0 };
const queue = (items: ReviewItem[], counts: Partial<ReviewQueue['counts']> = {}): ReviewQueue => ({
  items,
  counts: { ...zero, ...counts },
});

describe('ReviewPrinter', () => {
  describe('검토 목록', () => {
    it('확인할 혜택이 없으면 그렇다고 알려준다', () => {
      const text = printer.printQueue(queue([], { VERIFIED: 3 }));
      expect(text).toBe('혜택 검토 (확인됨 3 · 확인 전 0 · 원본 바뀜 0 · 원본 사라짐 0 · 원본 없음 0)\n확인할 혜택이 없습니다.');
    });

    it('상태별로 묶고, 바뀐 원본은 필드별 전후 값을 보여준다', () => {
      const text = printer.printQueue(
        queue([
          {
            slug: 'gov24-571000000116',
            name: '셋째 자녀 양육지원금',
            verifiedAt,
            status: {
              kind: 'SOURCE_CHANGED',
              changes: [{ ref: gov, fields: [{ field: '지원내용', before: '100만원', after: '200만원' }] }],
            },
          },
          { slug: 'gov24-1', name: '가', verifiedAt: null, status: { kind: 'UNVERIFIED' } },
          { slug: 'gov24-2', name: '나', verifiedAt: null, status: { kind: 'UNVERIFIED' } },
        ]),
      );

      expect(text).toContain(
        [
          '원본 바뀜 (마지막 확인 내용으로 게시 중)',
          '  gov24-571000000116  셋째 자녀 양육지원금  (마지막 확인 2026-11-02)',
          '      보조금24 571000000116',
          '        지원내용: "100만원" → "200만원"',
          '',
          '확인 전 ("검증 전"으로 게시 중)',
          '  gov24-1  가',
          '  gov24-2  나',
        ].join('\n'),
      );
      expect(text).toContain('pnpm benefit verify');
    });

    it('긴 값은 줄바꿈을 없애고 잘라서 보여준다', () => {
      const long = '가\r\n  나\r'.repeat(40);
      const text = printer.printQueue(
        queue([
          {
            slug: 's',
            name: 'n',
            verifiedAt,
            status: { kind: 'SOURCE_CHANGED', changes: [{ ref: gov, fields: [{ field: 'f', before: null, after: long }] }] },
          },
        ]),
      );
      const line = text.split('\n').find((l) => l.includes('f: null →'))!;
      expect(line).toContain('"가 나 가 나');
      expect(line).not.toMatch(/\\[rn]/);
      expect(line).toContain('…');
      expect(line.length).toBeLessThan(120);
    });

    it('사라진 원본은 어떤 원본인지 보여준다', () => {
      const text = printer.printQueue(queue([{ slug: 's', name: 'n', verifiedAt: null, status: { kind: 'SOURCE_REMOVED', refs: [gov] } }]));
      expect(text).toContain('원본 사라짐');
      expect(text).toContain('      보조금24 571000000116');
    });
  });

  describe('상세 채우기', () => {
    const local = new SourceRef('BOKJIRO_LOCAL', 'WLF00004802');
    const national = new SourceRef('BOKJIRO_NATIONAL', 'WLF00000001');

    it('건수와 함께 가정한 것과 확인이 필요한 것을 따로 보여준다', () => {
      const text = printer.printAdoption({
        adopted: [{ slug: 'a', ref: local }],
        assumed: [{ slug: 'bokjiro-wlf00000001', ref: national }],
        needsCheck: [
          { slug: 'bokjiro-wlf00004802', ref: local },
          { slug: 'bokjiro-wlf00004802', ref: national },
        ],
      });

      expect(text.split('\n')[0]).toBe('상세 본문 채우기: 채움 1 · 가정하고 채움 1 · 확인 필요 2');
      expect(text).toContain('가정: 확인 뒤 본문이 안 바뀌었다고 봄');
      expect(text).toContain('  bokjiro-wlf00000001  (복지로 WLF00000001)');
      expect(text).toContain('  bokjiro-wlf00004802  (복지로 WLF00004802)');
      expect(text.split('\n').at(-1)).toBe('pnpm benefit review <slug>로 보고, 맞으면 pnpm benefit verify bokjiro-wlf00004802');
    });

    it('채울 것이 없으면 건수만 보여준다', () => {
      expect(printer.printAdoption({ adopted: [], assumed: [], needsCheck: [] })).toBe(
        '상세 본문 채우기: 채움 0 · 가정하고 채움 0 · 확인 필요 0',
      );
    });
  });

  describe('확인 결과', () => {
    it('확인한 것과 실패한 것을 함께 보여준다', () => {
      const text = printer.printVerify({ verified: ['a', 'b'], failed: [{ slug: 'c', reason: '없는 혜택입니다' }] }, verifiedAt);
      expect(text).toBe('✔ 2건 확인 (2026-11-02): a, b\n✘ c: 없는 혜택입니다');
    });

    it('아무것도 넣지 않았으면 사용법을 알려준다', () => {
      expect(printer.printVerify({ verified: [], failed: [] }, verifiedAt)).toBe('확인할 slug를 넣어 주세요.');
    });
  });

  describe('목록 반영', () => {
    it('수정된 혜택과 목록에 없는 혜택을 알려준다', () => {
      const text = printer.printSync({ registered: ['a'], revised: ['b'], regrouped: ['c'], unchanged: 3, notInCatalog: ['z'] });
      expect(text).toBe(
        [
          '혜택 목록 반영: 새로 등록 1 · 수정 1 · 대상 묶음만 바뀜 1 · 그대로 3',
          '수정된 혜택은 다시 "검증 전"으로 바뀌었습니다: b',
          '목록 파일에 없는 혜택 (DB와 사이트에는 남아 있음): z',
          '사이트에서 빼려면: pnpm benefit retire z',
        ].join('\n'),
      );
    });
  });
});
