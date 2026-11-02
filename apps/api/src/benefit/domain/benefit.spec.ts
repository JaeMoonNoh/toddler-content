import { describe, expect, it } from 'vitest';
import { Benefit, InvalidBenefitError, NotVerifiableError, type BenefitDetails } from './benefit';
import { CurrentSources, type SourceState } from './current-sources';
import { SourceRef } from './source-ref';

const gov = new SourceRef('GOV24', '571000000116');
const bok = new SourceRef('BOKJIRO_LOCAL', 'WLF00003640');

const details = (overrides: Partial<BenefitDetails> = {}): BenefitDetails => ({
  slug: 'gov24-571000000116',
  name: '셋째 자녀 이상 양육지원금 지원',
  scope: 'cheongju',
  sourceUrl: 'https://plus.gov.kr/portal/benefit?svcId=571000000116',
  sources: [gov],
  ...overrides,
});

const state = (ref: SourceRef, hash = 'h1', payload: Record<string, unknown> = { 지원내용: '100만원' }, removed = false): SourceState => ({
  ref,
  hash,
  payload,
  removed,
});
const sources = (...states: SourceState[]) => new CurrentSources(states);
const at = new Date('2026-11-02T03:00:00Z');

describe('Benefit', () => {
  describe('등록', () => {
    it('올바른 정보면 확인 전 상태로 만든다', () => {
      const benefit = Benefit.register(details());
      expect(benefit.verifiedAt).toBeNull();
      expect(benefit.primarySource).toBe(gov);
    });

    it.each([
      ['slug에 대문자', { slug: 'Gov24-1' }, 'slug'],
      ['slug에 한글', { slug: '아동수당' }, 'slug'],
      ['slug가 -로 끝남', { slug: 'gov24-' }, 'slug'],
      ['이름이 공백', { name: '  ' }, '이름'],
      ['모르는 지역', { scope: 'seoul' as never }, '지역'],
      ['http 링크', { sourceUrl: 'http://plus.gov.kr' }, 'https'],
      ['원본 없음', { sources: [] }, '원본이 없습니다'],
      ['같은 원본 두 번', { sources: [gov, new SourceRef('GOV24', '571000000116')] }, '두 번'],
    ])('%s이면 거절한다', (_, overrides, message) => {
      expect(() => Benefit.register(details(overrides))).toThrow(InvalidBenefitError);
      expect(() => Benefit.register(details(overrides))).toThrow(message);
    });

    it('문제가 여러 개면 한 번에 모두 알려준다', () => {
      expect(() => Benefit.register(details({ name: '', sources: [] }))).toThrow(/이름이 비어 있습니다, 연결된 원본이 없습니다/);
    });
  });

  describe('검토 상태', () => {
    it('한 번도 확인하지 않았으면 확인 전', () => {
      expect(Benefit.register(details()).reviewStatus(sources(state(gov)))).toEqual({ kind: 'UNVERIFIED' });
    });

    it('확인한 뒤 원본이 그대로면 확인됨', () => {
      const benefit = Benefit.register(details()).verify(sources(state(gov)), at);
      expect(benefit.reviewStatus(sources(state(gov)))).toEqual({ kind: 'VERIFIED' });
    });

    it('확인한 뒤 원본이 바뀌면 바뀐 필드를 알려준다', () => {
      const benefit = Benefit.register(details()).verify(sources(state(gov, 'h1', { 지원내용: '100만원', 신청기한: '상시' })), at);
      const status = benefit.reviewStatus(sources(state(gov, 'h2', { 지원내용: '200만원', 신청기한: '상시' })));

      expect(status).toEqual({
        kind: 'SOURCE_CHANGED',
        changes: [{ ref: gov, fields: [{ field: '지원내용', before: '100만원', after: '200만원' }] }],
      });
    });

    it('바뀐 필드에 조회수처럼 매일 바뀌는 필드는 넣지 않는다', () => {
      const benefit = Benefit.register(details()).verify(sources(state(gov, 'h1', { 지원내용: 'a', 조회수: 1 })), at);
      const status = benefit.reviewStatus(sources(state(gov, 'h2', { 지원내용: 'b', 조회수: 99 })));

      expect(status.kind === 'SOURCE_CHANGED' && status.changes[0].fields.map((f) => f.field)).toEqual(['지원내용']);
    });

    it('원본이 둘이면 바뀐 원본만 알려준다', () => {
      const benefit = Benefit.register(details({ sources: [gov, bok] })).verify(sources(state(gov), state(bok, 'b1')), at);
      const status = benefit.reviewStatus(sources(state(gov), state(bok, 'b2', { servDgst: '바뀜' })));

      expect(status.kind).toBe('SOURCE_CHANGED');
      expect(status.kind === 'SOURCE_CHANGED' && status.changes.map((c) => c.ref)).toEqual([bok]);
    });

    it('원본이 바뀌었다가 확인 당시 내용으로 돌아오면 다시 확인됨', () => {
      const benefit = Benefit.register(details()).verify(sources(state(gov, 'h1')), at);
      expect(benefit.reviewStatus(sources(state(gov, 'h2'))).kind).toBe('SOURCE_CHANGED');
      expect(benefit.reviewStatus(sources(state(gov, 'h1'))).kind).toBe('VERIFIED');
    });

    it('원본이 출처에서 사라지면 확인 여부와 상관없이 원본 사라짐', () => {
      const removed = sources(state(gov, 'h1', {}, true));
      expect(Benefit.register(details()).reviewStatus(removed)).toEqual({ kind: 'SOURCE_REMOVED', refs: [gov] });
      expect(Benefit.register(details()).verify(sources(state(gov)), at).reviewStatus(removed).kind).toBe('SOURCE_REMOVED');
    });

    it('수집된 적 없는 원본을 가리키면 원본 없음', () => {
      expect(Benefit.register(details()).reviewStatus(sources())).toEqual({ kind: 'SOURCE_MISSING', refs: [gov] });
    });

    it('원본 없음이 원본 사라짐보다 먼저다', () => {
      const benefit = Benefit.register(details({ sources: [gov, bok] }));
      expect(benefit.reviewStatus(sources(state(gov, 'h1', {}, true))).kind).toBe('SOURCE_MISSING');
    });

    it('확인 기록에 없는 원본이 연결돼 있으면 확인 전', () => {
      const verified = Benefit.register(details()).verify(sources(state(gov)), at);
      const withNewSource = Benefit.restore(details({ sources: [gov, bok] }), verified.verification);

      expect(withNewSource.reviewStatus(sources(state(gov), state(bok))).kind).toBe('UNVERIFIED');
    });
  });

  describe('확인', () => {
    it('확인 시각과 그때 원본 모습을 남긴다', () => {
      const benefit = Benefit.register(details()).verify(sources(state(gov, 'h1', { 지원내용: 'a' })), at);
      expect(benefit.verification).toEqual({ verifiedAt: at, snapshots: [{ ref: gov, hash: 'h1', payload: { 지원내용: 'a' } }] });
    });

    it('원래 혜택은 바꾸지 않고 새 혜택을 돌려준다', () => {
      const original = Benefit.register(details());
      original.verify(sources(state(gov)), at);
      expect(original.verifiedAt).toBeNull();
    });

    it('원본이 바뀐 혜택을 다시 확인하면 확인됨이 되고 확인일이 바뀐다', () => {
      const later = new Date('2026-11-03T03:00:00Z');
      const benefit = Benefit.register(details()).verify(sources(state(gov, 'h1')), at).verify(sources(state(gov, 'h2')), later);

      expect(benefit.reviewStatus(sources(state(gov, 'h2'))).kind).toBe('VERIFIED');
      expect(benefit.verifiedAt).toBe(later);
    });

    it('원본이 사라졌거나 없으면 확인할 수 없다', () => {
      const benefit = Benefit.register(details());
      expect(() => benefit.verify(sources(state(gov, 'h1', {}, true)), at)).toThrow(NotVerifiableError);
      expect(() => benefit.verify(sources(), at)).toThrow('수집돼 있지 않아서');
    });
  });

  describe('정보 수정', () => {
    const verified = () => Benefit.register(details()).verify(sources(state(gov)), at);

    it('바뀐 게 없으면 확인 기록을 유지한다', () => {
      expect(verified().revise(details()).verifiedAt).toBe(at);
    });

    it.each([
      ['이름', { name: '셋째아 양육지원금' }],
      ['지역', { scope: 'chungbuk' as const }],
      ['원문 링크', { sourceUrl: 'https://www.bokjiro.go.kr/x' }],
      ['연결 원본', { sources: [gov] }],
      ['대표 출처 순서', { sources: [bok, gov] }],
    ])('%s이 바뀌면 다시 확인해야 한다', (_, overrides) => {
      const base = details({ sources: [gov, bok] });
      const benefit = Benefit.register(base).verify(sources(state(gov), state(bok)), at);
      const changed = { ...base, ...overrides };

      expect(benefit.revise(changed).verifiedAt).toBeNull();
    });

    it('slug는 바꿀 수 없다', () => {
      expect(() => verified().revise(details({ slug: 'other' }))).toThrow(InvalidBenefitError);
    });

    it('잘못된 정보로는 수정할 수 없다', () => {
      expect(() => verified().revise(details({ name: '' }))).toThrow(InvalidBenefitError);
    });
  });

  describe('게시', () => {
    const verified = () => Benefit.register(details()).verify(sources(state(gov, 'h1')), at);

    it('확인된 혜택은 게시한다', () => {
      expect(verified().isPublished(sources(state(gov, 'h1')))).toBe(true);
    });

    it('원본이 바뀌어도 마지막 확인 내용으로 계속 게시한다', () => {
      expect(verified().isPublished(sources(state(gov, 'h2')))).toBe(true);
    });

    it('확인 전, 원본 사라짐, 원본 없음은 게시하지 않는다', () => {
      expect(Benefit.register(details()).isPublished(sources(state(gov)))).toBe(false);
      expect(verified().isPublished(sources(state(gov, 'h1', {}, true)))).toBe(false);
      expect(verified().isPublished(sources())).toBe(false);
    });
  });
});
