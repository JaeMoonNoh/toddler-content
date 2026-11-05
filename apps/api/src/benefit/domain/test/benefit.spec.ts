import { describe, expect, it } from 'vitest';

import { Benefit, type BenefitDetails, InvalidBenefitError, NotVerifiableError } from '../benefit';
import { CurrentSources, type SourceState } from '../current-sources';
import { SourceRef } from '../source-ref';

import type { BenefitSchedule } from '../benefit-schedule';

const gov = new SourceRef('GOV24', '571000000116');
const bok = new SourceRef('BOKJIRO_LOCAL', 'WLF00003640');

const details = (overrides: Partial<BenefitDetails> = {}): BenefitDetails => ({
  slug: 'gov24-571000000116',
  name: '셋째 자녀 이상 양육지원금 지원',
  regionCode: '4311000000',
  sourceUrl: 'https://plus.gov.kr/portal/benefit?svcId=571000000116',
  sources: [gov],
  schedule: null,
  conditions: [],
  amount: null,
  applicationPeriod: null,
  howToApply: null,
  audience: null,
  plannedOn: null,
  ...overrides,
});

const schedule = (overrides: Partial<BenefitSchedule> = {}): BenefitSchedule => ({
  from: { anchor: 'birth', months: 0, days: 0 },
  until: { anchor: 'birth', months: 0, days: 59 },
  untilLabel: '소급 신청 마감',
  summary: '출생 후 60일 안에 신청해야 출생한 달부터 받아요',
  basis: { text: '출생일 포함 60일 이내 신청', url: 'https://www.bokjiro.go.kr' },
  ...overrides,
});

const state = (ref: SourceRef, payload: Record<string, unknown> = { 지원내용: '100만원' }, removed = false): SourceState => ({
  ref,
  payload,
  removed,
});
const changed = { 지원내용: '200만원' };
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
      ['지역 코드가 10자리가 아님', { regionCode: '43110' }, '법정동코드 10자리'],
      ['지역 코드에 글자', { regionCode: 'cheongju00' }, '법정동코드 10자리'],
      ['http 링크', { sourceUrl: 'http://plus.gov.kr' }, 'https'],
      ['원본 없음', { sources: [] }, '원본이 없습니다'],
      ['같은 원본 두 번', { sources: [gov, new SourceRef('GOV24', '571000000116')] }, '두 번'],
    ])('%s이면 거절한다', (_, overrides, message) => {
      expect(() => Benefit.register(details(overrides))).toThrow(InvalidBenefitError);
      expect(() => Benefit.register(details(overrides))).toThrow(message);
    });

    describe('신청 기간 규칙', () => {
      it('올바른 규칙이면 받는다', () => {
        expect(Benefit.register(details({ schedule: schedule() })).schedule).toEqual(schedule());
      });

      it('시작과 끝이 같은 날이어도 받는다', () => {
        expect(() => Benefit.register(details({ schedule: schedule({ until: { anchor: 'birth', months: 0, days: 0 } }) }))).not.toThrow();
      });

      it.each([
        ['끝이 시작보다 앞', { until: { anchor: 'birth' as const, months: 0, days: -1 } }, '앞입니다'],
        [
          '출생 기준 끝이 임신 기준 시작보다 앞',
          { from: { anchor: 'birth' as const, months: 1, days: 0 }, until: { anchor: 'pregnancy' as const, months: 9, days: 0 } },
          '앞입니다',
        ],
        ['마감 설명 없음', { untilLabel: ' ' }, '마감 설명'],
        ['설명 없음', { summary: '' }, '일정 설명'],
        ['근거 문장 없음', { basis: { text: '', url: 'https://a.kr' } }, '근거 문장'],
        ['근거 링크가 http', { basis: { text: '근거', url: 'http://a.kr' } }, '근거 링크'],
      ])('%s이면 거절한다', (_, overrides, message) => {
        expect(() => Benefit.register(details({ schedule: schedule(overrides) }))).toThrow(message);
      });

      it('임신 기준 시작과 출생 기준 끝을 섞어 쓸 수 있다', () => {
        const mixed = schedule({ from: { anchor: 'pregnancy', months: 0, days: 0 }, until: { anchor: 'birth', months: 24, days: 0 } });
        expect(() => Benefit.register(details({ schedule: mixed }))).not.toThrow();
      });
    });

    describe('받기 위한 조건', () => {
      it('알려진 조건이면 받는다', () => {
        expect(Benefit.register(details({ conditions: ['BIRTH_PARENT_INSURED', 'PARTNER_INSURED'] })).conditions).toHaveLength(2);
      });

      it.each([
        ['모르는 조건', ['MULTI_CHILD'], '알 수 없는 조건'],
        ['같은 조건 두 번', ['PARTNER_INSURED', 'PARTNER_INSURED'], '두 번'],
        ['가입과 미가입을 함께', ['BIRTH_PARENT_INSURED', 'BIRTH_PARENT_UNINSURED'], '함께 요구할 수 없습니다'],
        ['집에서 돌봄과 어린이집 이용을 함께', ['HOME_CARE', 'USES_CHILDCARE'], '함께 요구할 수 없습니다'],
      ])('%s이면 거절한다', (_, conditions, message) => {
        expect(() => Benefit.register(details({ conditions: conditions as never }))).toThrow(message);
      });
    });

    it('신청 기간에 문제가 있으면 거절한다', () => {
      const applicationPeriod = { start: '2026-12-31', end: '2026-01-01', basis: { text: '근거', url: 'https://a.kr' } };
      expect(() => Benefit.register(details({ applicationPeriod }))).toThrow('시작일보다 앞');
    });

    it('금액에 문제가 있으면 거절한다', () => {
      const amount = { kind: 'cash' as const, summary: '월 10만원', tiers: [], basis: { text: '근거', url: 'https://a.kr' } };
      expect(() => Benefit.register(details({ amount }))).toThrow('금액 구간이 비어');
    });

    it.each([
      ['설명이 비어 있으면', { summary: ' ', basis: { text: '방문신청', url: 'https://a.kr' } }, '신청 방법 설명이 비어'],
      ['근거 문장이 비어 있으면', { summary: '주민센터 방문', basis: { text: '', url: 'https://a.kr' } }, '근거 문장이 비어'],
      ['근거 링크가 https가 아니면', { summary: '주민센터 방문', basis: { text: '방문신청', url: 'http://a.kr' } }, 'https 주소여야'],
    ])('신청 방법의 %s 거절한다', (_, howToApply, message) => {
      expect(() => Benefit.register(details({ howToApply }))).toThrow(message);
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
      const benefit = Benefit.register(details()).verify(sources(state(gov, { 지원내용: '100만원', 신청기한: '상시' })), at);
      const status = benefit.reviewStatus(sources(state(gov, { 지원내용: '200만원', 신청기한: '상시' })));

      expect(status).toEqual({
        kind: 'SOURCE_CHANGED',
        changes: [{ ref: gov, fields: [{ field: '지원내용', before: '100만원', after: '200만원' }] }],
      });
    });

    it('바뀐 필드에 조회수처럼 매일 바뀌는 필드는 넣지 않는다', () => {
      const benefit = Benefit.register(details()).verify(sources(state(gov, { 지원내용: 'a', 조회수: 1 })), at);
      const status = benefit.reviewStatus(sources(state(gov, { 지원내용: 'b', 조회수: 99 })));

      expect(status.kind === 'SOURCE_CHANGED' && status.changes[0].fields.map((f) => f.field)).toEqual(['지원내용']);
    });

    it('원본이 둘이면 바뀐 원본만 알려준다', () => {
      const benefit = Benefit.register(details({ sources: [gov, bok] })).verify(sources(state(gov), state(bok)), at);
      const status = benefit.reviewStatus(sources(state(gov), state(bok, { servDgst: '바뀜' })));

      expect(status.kind).toBe('SOURCE_CHANGED');
      expect(status.kind === 'SOURCE_CHANGED' && status.changes.map((c) => c.ref)).toEqual([bok]);
    });

    it('원본이 바뀌었다가 확인 당시 내용으로 돌아오면 다시 확인됨', () => {
      const benefit = Benefit.register(details()).verify(sources(state(gov)), at);
      expect(benefit.reviewStatus(sources(state(gov, changed))).kind).toBe('SOURCE_CHANGED');
      expect(benefit.reviewStatus(sources(state(gov))).kind).toBe('VERIFIED');
    });

    describe('복지로 지자체의 순서 없는 목록 필드', () => {
      const local = new SourceRef('BOKJIRO_LOCAL', 'L1');
      const lists = (life: string) => ({ lifeNmArray: life, intrsThemaNmArray: '임신·출산, 보육', trgterIndvdlNmArray: '영유아, 임산부' });
      const verifiedWith = (life: string) => Benefit.register(details({ sources: [local] })).verify(sources(state(local, lists(life))), at);

      it('확인한 뒤 순서만 바뀌면 확인됨', () => {
        const benefit = verifiedWith('노년, 청소년, 청년');
        expect(benefit.reviewStatus(sources(state(local, lists('청년, 노년, 청소년')))).kind).toBe('VERIFIED');
      });

      it('확인 당시 어떤 순서로 저장됐든 지금 같은 원소면 확인됨', () => {
        const benefit = verifiedWith('청년, 노년, 청소년');
        expect(benefit.reviewStatus(sources(state(local, lists('노년, 청소년, 청년')))).kind).toBe('VERIFIED');
      });

      it('원소가 추가되면 그 필드만 바뀐 것으로 알려준다', () => {
        const benefit = verifiedWith('노년, 청년');
        const status = benefit.reviewStatus(sources(state(local, lists('청년, 노년, 영유아'))));

        expect(status).toEqual({
          kind: 'SOURCE_CHANGED',
          changes: [{ ref: local, fields: [{ field: 'lifeNmArray', before: '노년, 청년', after: '청년, 노년, 영유아' }] }],
        });
      });

      it('원소가 빠져도 원본이 바뀐 것이다', () => {
        const benefit = verifiedWith('노년, 청년, 영유아');
        expect(benefit.reviewStatus(sources(state(local, lists('청년, 노년')))).kind).toBe('SOURCE_CHANGED');
      });
    });

    it('원본이 출처에서 사라지면 확인 여부와 상관없이 원본 사라짐', () => {
      const removed = sources(state(gov, {}, true));
      expect(Benefit.register(details()).reviewStatus(removed)).toEqual({ kind: 'SOURCE_REMOVED', refs: [gov] });
      expect(
        Benefit.register(details())
          .verify(sources(state(gov)), at)
          .reviewStatus(removed).kind,
      ).toBe('SOURCE_REMOVED');
    });

    it('수집된 적 없는 원본을 가리키면 원본 없음', () => {
      expect(Benefit.register(details()).reviewStatus(sources())).toEqual({ kind: 'SOURCE_MISSING', refs: [gov] });
    });

    it('원본 없음이 원본 사라짐보다 먼저다', () => {
      const benefit = Benefit.register(details({ sources: [gov, bok] }));
      expect(benefit.reviewStatus(sources(state(gov, {}, true))).kind).toBe('SOURCE_MISSING');
    });

    it('확인 기록에 없는 원본이 연결돼 있으면 확인 전', () => {
      const verified = Benefit.register(details()).verify(sources(state(gov)), at);
      const withNewSource = Benefit.restore(details({ sources: [gov, bok] }), verified.verification);

      expect(withNewSource.reviewStatus(sources(state(gov), state(bok))).kind).toBe('UNVERIFIED');
    });
  });

  describe('확인', () => {
    it('확인 시각과 그때 원본 모습을 남긴다', () => {
      const benefit = Benefit.register(details()).verify(sources(state(gov, { 지원내용: 'a' })), at);
      expect(benefit.verification).toEqual({ verifiedAt: at, snapshots: [{ ref: gov, payload: { 지원내용: 'a' } }] });
    });

    it('원래 혜택은 바꾸지 않고 새 혜택을 돌려준다', () => {
      const original = Benefit.register(details());
      original.verify(sources(state(gov)), at);
      expect(original.verifiedAt).toBeNull();
    });

    it('원본이 바뀐 혜택을 다시 확인하면 확인됨이 되고 확인일이 바뀐다', () => {
      const later = new Date('2026-11-03T03:00:00Z');
      const benefit = Benefit.register(details())
        .verify(sources(state(gov)), at)
        .verify(sources(state(gov, changed)), later);

      expect(benefit.reviewStatus(sources(state(gov, changed))).kind).toBe('VERIFIED');
      expect(benefit.verifiedAt).toBe(later);
    });

    it('원본이 사라졌거나 없으면 확인할 수 없다', () => {
      const benefit = Benefit.register(details());
      expect(() => benefit.verify(sources(state(gov, {}, true)), at)).toThrow(NotVerifiableError);
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
      ['지역', { regionCode: '4300000000' }],
      ['원문 링크', { sourceUrl: 'https://www.bokjiro.go.kr/x' }],
      ['연결 원본', { sources: [gov] }],
      ['대표 출처 순서', { sources: [bok, gov] }],
      ['신청 기간 규칙 추가', { schedule: schedule() }],
      ['받기 위한 조건 추가', { conditions: ['EITHER_PARENT_INSURED' as const] }],
      [
        '금액 추가',
        {
          amount: {
            kind: 'cash' as const,
            summary: '월 10만원',
            tiers: [{ minBirthOrder: 1, maxBirthOrder: null, won: 9_600_000 }],
            basis: { text: '월 10만원', url: 'https://a.kr' },
          },
        },
      ],
      ['신청 방법 추가', { howToApply: { summary: '주민센터 방문', basis: { text: '방문신청', url: 'https://a.kr' } } }],
    ])('%s이 바뀌면 다시 확인해야 한다', (_, overrides) => {
      const base = details({ sources: [gov, bok] });
      const benefit = Benefit.register(base).verify(sources(state(gov), state(bok)), at);
      const changed = { ...base, ...overrides };

      expect(benefit.revise(changed).verifiedAt).toBeNull();
    });

    it('신청 기간 규칙이 같으면 확인 기록을 유지한다', () => {
      const withSchedule = Benefit.register(details({ schedule: schedule() })).verify(sources(state(gov)), at);
      expect(withSchedule.revise(details({ schedule: schedule() })).verifiedAt).toBe(at);
      expect(withSchedule.revise(details({ schedule: schedule({ summary: '바뀐 설명' }) })).verifiedAt).toBeNull();
    });

    it('조건 순서만 다르면 바뀐 것으로 보지 않는다', () => {
      const benefit = Benefit.register(details({ conditions: ['BIRTH_PARENT_INSURED', 'PARTNER_INSURED'] })).verify(
        sources(state(gov)),
        at,
      );
      expect(benefit.revise(details({ conditions: ['PARTNER_INSURED', 'BIRTH_PARENT_INSURED'] })).verifiedAt).toBe(at);
    });

    it('대상 묶음만 바뀌면 확인 기록을 유지하고 묶음은 바꾼다', () => {
      const revised = verified().revise(details({ audience: 'LOW_INCOME' }));
      expect(revised.verifiedAt).toBe(at);
      expect(revised.audience).toBe('LOW_INCOME');
    });

    it('대상 묶음과 다른 정보가 함께 바뀌면 다시 확인해야 한다', () => {
      expect(verified().revise(details({ audience: 'LOW_INCOME', name: '이름 바꿈' })).verifiedAt).toBeNull();
    });

    it('모르는 대상 묶음으로는 바꿀 수 없다', () => {
      expect(() => verified().revise(details({ audience: 'VIP' as never }))).toThrow('알 수 없는 대상 묶음');
    });

    it.each([
      [{}, 'none'],
      [{ audience: 'LOW_INCOME' as const }, 'audience'],
      [{ name: '이름 바꿈' }, 'content'],
      [{ name: '이름 바꿈', audience: 'LOW_INCOME' as const }, 'content'],
    ])('바뀐 것 %o는 %s', (overrides, kind) => {
      expect(Benefit.register(details()).changeKind(details(overrides))).toBe(kind);
    });

    it('slug는 바꿀 수 없다', () => {
      expect(() => verified().revise(details({ slug: 'other' }))).toThrow(InvalidBenefitError);
    });

    it('잘못된 정보로는 수정할 수 없다', () => {
      expect(() => verified().revise(details({ name: '' }))).toThrow(InvalidBenefitError);
    });
  });

  describe('게시', () => {
    const verified = () => Benefit.register(details()).verify(sources(state(gov)), at);

    it('확인된 혜택은 게시한다', () => {
      expect(verified().isPublished(sources(state(gov)))).toBe(true);
    });

    it('원본이 바뀌어도 마지막 확인 내용으로 계속 게시한다', () => {
      expect(verified().isPublished(sources(state(gov, changed)))).toBe(true);
    });

    it('확인 전 혜택도 게시한다 (화면에 "검증 전"으로 표시)', () => {
      expect(Benefit.register(details()).isPublished(sources(state(gov)))).toBe(true);
    });

    it('원본이 사라졌거나 없으면 확인 여부와 상관없이 게시하지 않는다', () => {
      expect(Benefit.register(details()).isPublished(sources(state(gov, {}, true)))).toBe(false);
      expect(verified().isPublished(sources(state(gov, {}, true)))).toBe(false);
      expect(Benefit.register(details()).isPublished(sources())).toBe(false);
      expect(verified().isPublished(sources())).toBe(false);
    });
  });
});
