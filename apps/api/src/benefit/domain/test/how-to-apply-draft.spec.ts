import { describe, expect, it } from 'vitest';

import { draftHowToApply } from '../how-to-apply-draft';
import { SourceRef } from '../source-ref';

const URL = 'https://plus.gov.kr/x';
const SEOUL_GU = '1168000000';
const GYEONGGI = '4100000000';
const gov24 = (id: string, payload: Record<string, unknown>) => ({ ref: new SourceRef('GOV24', id), payload });
const bokjiro = (id: string, aplyMtdNm: string) => ({ ref: new SourceRef('BOKJIRO_LOCAL', id), payload: { aplyMtdNm } });
const summaryOf = (sources: Parameters<typeof draftHowToApply>[0], regionCode = SEOUL_GU) =>
  draftHowToApply(sources, URL, regionCode)?.summary;

describe('draftHowToApply', () => {
  it('접수기관과 신청방법, 전화번호를 한 줄로', () => {
    expect(
      draftHowToApply(
        [
          gov24('1', {
            신청방법: '방문신청||정부24온라인신청||기타 온라인신청',
            접수기관: '읍면동 주민센터',
            전화문의: '강남구청/02-3423-5000',
          }),
        ],
        URL,
        SEOUL_GU,
      ),
    ).toEqual({
      summary: '주민센터 방문 또는 정부24 온라인 · 문의 02-3423-5000',
      basis: {
        text: '신청방법: 방문신청, 정부24온라인신청, 기타 온라인신청 / 접수기관: 읍면동 주민센터 / 전화문의: 강남구청/02-3423-5000',
        url: URL,
      },
    });
  });

  it('신청이 필요 없으면 그렇게 쓴다', () => {
    expect(summaryOf([gov24('1', { 신청방법: '신청불필요' })])).toBe('따로 신청하지 않아도 돼요');
  });

  it('지역번호가 하나뿐인 시·도는 빠진 지역번호를 붙인다', () => {
    expect(summaryOf([gov24('1', { 신청방법: '방문신청', 전화문의: '보건소/3423-7000' })])).toBe('방문 · 문의 02-3423-7000');
  });

  it('지역번호가 여러 개인 경기는 지역번호가 빠진 번호를 쓰지 않는다', () => {
    expect(summaryOf([gov24('1', { 신청방법: '방문신청', 전화문의: '보건소/3423-7000' })], GYEONGGI)).toBe('방문');
  });

  it('서울 다산콜센터 02-120은 120으로, 다른 시·도의 031-120은 쓰지 않는다', () => {
    expect(summaryOf([gov24('1', { 신청방법: '방문신청', 전화문의: '다산콜센터/02-120' })])).toBe('방문 · 문의 120');
    expect(summaryOf([gov24('1', { 신청방법: '방문신청', 전화문의: '경기도 콜센터/031-120' })], GYEONGGI)).toBe('방문');
  });

  it('전화문의가 여러 곳이면 번호를 고르지 않는다', () => {
    expect(summaryOf([gov24('1', { 신청방법: '방문신청', 전화문의: '수원시/031-111-1111||고양시/031-222-2222' })], GYEONGGI)).toBe('방문');
  });

  it('보조금24 원본이 여러 개인 카드는 번호를 쓰지 않는다', () => {
    const sources = [
      gov24('1', { 신청방법: '방문신청', 전화문의: '중구보건소/02-111-1111' }),
      gov24('2', { 신청방법: '방문신청', 전화문의: '종로구보건소/02-222-2222' }),
    ];
    expect(summaryOf(sources)).toBe('방문');
  });

  it('보조금24에서 정할 수 없으면 복지로 신청방법을 쓴다', () => {
    expect(summaryOf([gov24('1', { 신청방법: '기타' }), bokjiro('W1', '인터넷, 방문')])).toBe('방문 또는 온라인');
  });

  it('어느 원본으로도 정할 수 없으면 null', () => {
    expect(summaryOf([bokjiro('W1', '')])).toBeUndefined();
    expect(draftHowToApply([], URL, SEOUL_GU)).toBeNull();
  });

  it('긴 접수기관 이름은 빼고 방법만 쓴다', () => {
    expect(summaryOf([gov24('1', { 신청방법: '방문신청', 접수기관: '서울특별시 강남구 보건소 건강관리과 모자보건팀' })])).toBe('방문');
  });
});
