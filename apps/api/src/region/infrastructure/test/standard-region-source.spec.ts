import { describe, expect, it } from 'vitest';

import { HttpClient } from '../../../shared/infrastructure/http-client';
import { ServiceKey } from '../../../shared/infrastructure/service-key';
import { FakeFetch } from '../../../shared/infrastructure/test/fakes/fake-fetch';
import { NATIONWIDE_CODE } from '../../domain/region';
import { type StandardRegionRow, StandardRegionSource, toRegions } from '../sources/standard-region-source';

const row = (code: string, fullName: string, high: string, umd = '000', ri = '00'): StandardRegionRow => ({
  region_cd: code,
  umd_cd: umd,
  ri_cd: ri,
  locatadd_nm: fullName,
  locallow_nm: fullName.split(' ').at(-1)!,
  locathigh_cd: high,
});
const ROWS = [
  row('4300000000', '충청북도', NATIONWIDE_CODE),
  row('4311000000', '충청북도 청주시', '4300000000'),
  row('4311100000', '충청북도 청주시 상당구', '4300000000'), // 원본은 일반구의 위를 도로 적는다
  row('4311110100', '충청북도 청주시 상당구 영동', '4311100000', '101'),
  row('4372025021', '충청북도 보은군 보은읍 이평리', '4372025000', '250', '21'),
  row('3611000000', '세종특별자치시', NATIONWIDE_CODE),
];
const page = (rows: StandardRegionRow[], totalCount: number, resultCode = 'INFO-0') => ({
  body: JSON.stringify({
    StanReginCd: [{ head: [{ totalCount }, { numOfRows: '1000' }, { RESULT: { resultCode, resultMsg: '메시지' } }] }, { row: rows }],
  }),
});
const pageNo = (n: number) => (url: URL) => url.searchParams.get('pageNo') === String(n);
const sourceWith = (fake: FakeFetch) => new StandardRegionSource(new HttpClient(fake.fetch, { retries: 0 }), new ServiceKey('TEST-KEY'));

describe('toRegions', () => {
  const regions = toRegions(ROWS);
  const parentOf = (name: string) => regions.find((r) => r.name === name)?.parentCode;

  it('시·도와 시·군·구만 남기고 맨 앞에 전국을 둔다', () => {
    expect(regions.map((r) => r.name)).toEqual(['전국', '세종특별자치시', '충청북도', '청주시', '상당구']);
  });

  it('일반구는 이름으로 시를 찾아 그 아래에 둔다', () => {
    expect(parentOf('상당구')).toBe('4311000000');
  });

  it('시·도와 세종은 전국 아래에 있다', () => {
    expect(parentOf('충청북도')).toBe(NATIONWIDE_CODE);
    expect(parentOf('세종특별자치시')).toBe(NATIONWIDE_CODE);
  });

  it('이름 앞뒤 공백을 지운다', () => {
    expect(
      toRegions([{ ...row('4300000000', '충청북도', NATIONWIDE_CODE), locatadd_nm: ' 충청북도 ', locallow_nm: '충청북도 ' }])[1],
    ).toMatchObject({
      name: '충청북도',
      fullName: '충청북도',
    });
  });

  it('빈 목록이면 전국만 남는다', () => {
    expect(toRegions([]).map((r) => r.code)).toEqual([NATIONWIDE_CODE]);
  });
});

describe('StandardRegionSource', () => {
  it('전체 건수만큼 페이지를 받고, 인증키를 붙여 요청한다', async () => {
    const fake = new FakeFetch().on(pageNo(1), page(ROWS.slice(0, 3), 1001)).on(pageNo(2), page(ROWS.slice(3), 1001));
    const regions = await sourceWith(fake).fetchAll();

    expect(fake.requests.map((r) => r.searchParams.get('pageNo'))).toEqual(['1', '2']);
    expect(fake.requests[0].searchParams.get('serviceKey')).toBe('TEST-KEY');
    expect(fake.requests[0].searchParams.get('numOfRows')).toBe('1000');
    expect(regions).toHaveLength(5);
  });

  it('딱 1000건이면 한 페이지만 받는다', async () => {
    const fake = new FakeFetch().on(pageNo(1), page(ROWS, 1000));
    await sourceWith(fake).fetchAll();
    expect(fake.requests).toHaveLength(1);
  });

  it('등록되지 않은 인증키면 게이트웨이 메시지로 실패한다', async () => {
    const body = JSON.stringify({ OpenAPI_ServiceResponse: { cmmMsgHeader: { returnAuthMsg: '등록되지 않은 서비스키' } } });
    await expect(sourceWith(new FakeFetch().on(pageNo(1), { body })).fetchAll()).rejects.toThrow('등록되지 않은 서비스키');
  });

  it('결과 코드가 정상이 아니면 실패한다', async () => {
    await expect(sourceWith(new FakeFetch().on(pageNo(1), page([], 0, 'ERROR-300'))).fetchAll()).rejects.toThrow('법정동코드: 메시지');
  });

  it('JSON이 아닌 응답이면 실패한다', async () => {
    await expect(sourceWith(new FakeFetch().on(pageNo(1), { body: '<html>점검 중</html>' })).fetchAll()).rejects.toThrow(
      'JSON이 아닌 응답',
    );
  });

  it('전체 건수가 없으면 실패한다', async () => {
    const body = JSON.stringify({ StanReginCd: [{ head: [{ RESULT: { resultCode: 'INFO-0' } }] }, { row: [] }] });
    await expect(sourceWith(new FakeFetch().on(pageNo(1), { body })).fetchAll()).rejects.toThrow('전체 건수');
  });
});
