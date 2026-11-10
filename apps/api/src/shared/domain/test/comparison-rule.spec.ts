import { describe, expect, it } from 'vitest';

import { ComparisonRule } from '../comparison-rule';

import type { SourceId } from '../source-id';

const gov24 = ComparisonRule.of('GOV24');
const local = ComparisonRule.of('BOKJIRO_LOCAL');
const national = ComparisonRule.of('BOKJIRO_NATIONAL');

describe('ComparisonRule.isSame', () => {
  it('키 순서가 달라도 같다', () => {
    expect(gov24.isSame({ a: 1, b: { c: 2, d: 3 } }, { b: { d: 3, c: 2 }, a: 1 })).toBe(true);
  });

  it('조회수만 다르면 같다', () => {
    expect(gov24.isSame({ 서비스명: '아동수당', 조회수: 10 }, { 서비스명: '아동수당', 조회수: 999 })).toBe(true);
    expect(national.isSame({ servNm: 'A', inqNum: '1' }, { servNm: 'A', inqNum: '2' })).toBe(true);
  });

  it('조회수 필드가 아예 없어져도 같다', () => {
    expect(gov24.isSame({ 서비스명: 'A', 조회수: 10 }, { 서비스명: 'A' })).toBe(true);
  });

  it('출처마다 조회수 필드 이름이 다르다', () => {
    expect(gov24.isSame({ inqNum: '1' }, { inqNum: '2' })).toBe(false);
    expect(national.isSame({ 조회수: 1 }, { 조회수: 2 })).toBe(false);
  });

  it('값이 undefined인 키는 키가 없는 것과 같다', () => {
    expect(gov24.isSame({ a: 1, b: undefined }, { a: 1 })).toBe(true);
  });

  it('null과 빈 문자열은 다르다', () => {
    expect(gov24.isSame({ a: null }, { a: '' })).toBe(false);
  });

  it('배열은 순서가 바뀌면 다르다', () => {
    expect(gov24.isSame({ a: [1, 2] }, { a: [2, 1] })).toBe(false);
  });

  it('문장 끝 공백 하나도 다르다', () => {
    expect(gov24.isSame({ a: '월 10만원' }, { a: '월 10만원 ' })).toBe(false);
  });

  describe('복지로 지자체의 순서 없는 목록 필드', () => {
    const fields = ['lifeNmArray', 'intrsThemaNmArray', 'trgterIndvdlNmArray'];

    it.each(fields)('%s는 순서만 달라도 같다', (field) => {
      expect(local.isSame({ [field]: '노년, 청소년, 청년' }, { [field]: '청년, 노년, 청소년' })).toBe(true);
    });

    it('원소가 하나 늘면 다르다', () => {
      expect(local.isSame({ lifeNmArray: '노년, 청년' }, { lifeNmArray: '노년, 청년, 영유아' })).toBe(false);
    });

    it('원소가 하나 빠지면 다르다', () => {
      expect(local.isSame({ lifeNmArray: '노년, 청년, 영유아' }, { lifeNmArray: '노년, 청년' })).toBe(false);
    });

    it('원소가 바뀌면 다르다', () => {
      expect(local.isSame({ lifeNmArray: '노년, 청년' }, { lifeNmArray: '노년, 영유아' })).toBe(false);
    });

    it('중복 원소는 지우지 않는다', () => {
      expect(local.isSame({ lifeNmArray: '청년, 청년' }, { lifeNmArray: '청년' })).toBe(false);
    });

    it('쉼표 뒤 공백이 다르면 다른 값이다', () => {
      expect(local.isSame({ lifeNmArray: '노년,청년' }, { lifeNmArray: '노년, 청년' })).toBe(false);
    });

    it('필드가 없거나 비었거나 문자열이 아니어도 던지지 않는다', () => {
      expect(local.isSame({}, {})).toBe(true);
      expect(local.isSame({ lifeNmArray: '' }, { lifeNmArray: '' })).toBe(true);
      expect(local.isSame({ lifeNmArray: ['노년', '청년'] }, { lifeNmArray: ['청년', '노년'] })).toBe(false);
      expect(local.isSame({ lifeNmArray: null }, { lifeNmArray: 3 })).toBe(false);
    });

    it('없음과 빈 문자열은 다르다', () => {
      expect(local.isSame({}, { lifeNmArray: '' })).toBe(false);
    });

    it('순서 무시 대상이 아닌 쉼표 목록은 순서가 달라도 다르다', () => {
      expect(local.isSame({ aplyMtdNm: '방문, 온라인' }, { aplyMtdNm: '온라인, 방문' })).toBe(false);
      expect(local.isSame({ srvPvsnNm: '현금, 현물' }, { srvPvsnNm: '현물, 현금' })).toBe(false);
    });

    it('자유 문장의 쉼표는 나누지 않는다', () => {
      expect(local.isSame({ servDgst: '신청은 방문, 우편' }, { servDgst: '우편, 신청은 방문' })).toBe(false);
    });

    it('중앙부처와 보조금24는 순서를 무시하지 않는다', () => {
      expect(national.isSame({ lifeArray: '001,007' }, { lifeArray: '007,001' })).toBe(false);
      expect(gov24.isSame({ lifeNmArray: '노년, 청년' }, { lifeNmArray: '청년, 노년' })).toBe(false);
    });
  });

  it('모든 출처에 규칙이 있다', () => {
    const sources: SourceId[] = ['GOV24', 'BOKJIRO_NATIONAL', 'BOKJIRO_LOCAL'];
    for (const source of sources) expect(ComparisonRule.of(source).isSame({}, {})).toBe(true);
  });
});

describe('ComparisonRule.changedFields', () => {
  it('바뀐 필드만 이름순으로 돌려준다', () => {
    expect(gov24.changedFields({ b: 1, a: 1, c: 1 }, { b: 2, a: 2, c: 1 })).toEqual([
      { field: 'a', before: 1, after: 2 },
      { field: 'b', before: 1, after: 2 },
    ]);
  });

  it('조회수는 바뀌어도 돌려주지 않는다', () => {
    expect(gov24.changedFields({ 조회수: 1 }, { 조회수: 2 })).toEqual([]);
  });

  it('중첩 객체는 키 순서만 다르면 바뀌지 않은 것으로 본다', () => {
    expect(gov24.changedFields({ a: { x: 1, y: 2 } }, { a: { y: 2, x: 1 } })).toEqual([]);
  });

  it('새로 생긴 필드와 없어진 필드는 null과 비교해 돌려준다', () => {
    expect(gov24.changedFields({ a: 1 }, { b: 2 })).toEqual([
      { field: 'a', before: 1, after: null },
      { field: 'b', before: null, after: 2 },
    ]);
  });

  it('순서만 다른 필드는 빼고 실제로 바뀐 필드만 돌려준다', () => {
    const before = { lifeNmArray: '노년, 청년', intrsThemaNmArray: '보육, 임신·출산', servNm: 'A' };
    const after = { lifeNmArray: '청년, 노년', intrsThemaNmArray: '보육, 임신·출산, 교육', servNm: 'A' };

    expect(local.changedFields(before, after)).toEqual([
      { field: 'intrsThemaNmArray', before: '보육, 임신·출산', after: '보육, 임신·출산, 교육' },
    ]);
  });

  it('before와 after는 출처가 준 순서 그대로 돌려준다', () => {
    expect(local.changedFields({ lifeNmArray: '청년, 노년' }, { lifeNmArray: '청년, 노년, 영유아' })).toEqual([
      { field: 'lifeNmArray', before: '청년, 노년', after: '청년, 노년, 영유아' },
    ]);
  });
});

describe('ComparisonRule.ofDetail', () => {
  const nationalDetail = ComparisonRule.ofDetail('BOKJIRO_NATIONAL');
  const localDetail = ComparisonRule.ofDetail('BOKJIRO_LOCAL');

  it('결과 코드·메시지와 조회수는 비교에서 뺀다', () => {
    expect(
      nationalDetail.changedFields({ tgtrDtlCn: 'A', resultCode: '0', inqNum: '1' }, { tgtrDtlCn: 'A', resultMessage: 'OK', inqNum: '2' }),
    ).toEqual([]);
  });

  it('출처마다 순서 없는 목록 필드 이름이 다르다', () => {
    expect(nationalDetail.isSame({ lifeArray: '아동, 영유아' }, { lifeArray: '영유아, 아동' })).toBe(true);
    expect(localDetail.isSame({ lifeNmArray: '아동, 영유아' }, { lifeNmArray: '영유아, 아동' })).toBe(true);
    expect(localDetail.isSame({ lifeArray: '아동, 영유아' }, { lifeArray: '영유아, 아동' })).toBe(false);
  });

  it('목록 규칙은 그대로다', () => {
    expect(ComparisonRule.of('BOKJIRO_LOCAL').isSame({ resultCode: '0' }, { resultCode: '1' })).toBe(false);
  });
});

describe('ComparisonRule.forReview', () => {
  it('복지로 지자체 목록의 수정일만 바뀌면 같다', () => {
    expect(
      ComparisonRule.forReview('BOKJIRO_LOCAL').isSame({ servNm: 'A', lastModYmd: '20260716' }, { servNm: 'A', lastModYmd: '20261105' }),
    ).toBe(true);
  });

  it('보조금24의 수정일시·등록일시만 바뀌면 같다', () => {
    const before = { 지원내용: 'A', 수정일시: '20260101000000', 등록일시: '20250101000000' };
    expect(ComparisonRule.forReview('GOV24').changedFields(before, { 지원내용: 'A', 수정일시: '20261105000000' })).toEqual([]);
  });

  it('수정일과 함께 내용이 바뀌면 내용 필드만 알려준다', () => {
    expect(
      ComparisonRule.forReview('BOKJIRO_LOCAL').changedFields({ servDgst: 'A', lastModYmd: '1' }, { servDgst: 'B', lastModYmd: '2' }),
    ).toEqual([{ field: 'servDgst', before: 'A', after: 'B' }]);
  });

  it('조회수와 순서 없는 목록 규칙은 목록 규칙 그대로 따른다', () => {
    const rule = ComparisonRule.forReview('BOKJIRO_LOCAL');
    expect(rule.isSame({ inqNum: '1', lifeNmArray: '청년, 노년' }, { inqNum: '2', lifeNmArray: '노년, 청년' })).toBe(true);
  });

  it('수집의 변경 감지는 여전히 수정일 변경을 잡는다', () => {
    expect(ComparisonRule.of('BOKJIRO_LOCAL').isSame({ lastModYmd: '1' }, { lastModYmd: '2' })).toBe(false);
    expect(ComparisonRule.of('GOV24').isSame({ 수정일시: '1' }, { 수정일시: '2' })).toBe(false);
  });
});

describe('ComparisonRule.forDetailReview', () => {
  it('복지로 지자체 상세의 수정일만 바뀌면 같다', () => {
    const rule = ComparisonRule.forDetailReview('BOKJIRO_LOCAL');
    expect(rule.isSame({ alwServCn: 'A', lastModYmd: '1', resultCode: '0' }, { alwServCn: 'A', lastModYmd: '2', resultCode: '1' })).toBe(
      true,
    );
  });

  it('본문이 바뀌면 그 필드를 알려준다', () => {
    expect(ComparisonRule.forDetailReview('BOKJIRO_NATIONAL').changedFields({ alwServCn: 'A' }, { alwServCn: 'B' })).toEqual([
      { field: 'alwServCn', before: 'A', after: 'B' },
    ]);
  });

  it('상세 수집의 변경 감지는 여전히 수정일 변경을 잡는다', () => {
    expect(ComparisonRule.ofDetail('BOKJIRO_LOCAL').isSame({ lastModYmd: '1' }, { lastModYmd: '2' })).toBe(false);
  });
});
