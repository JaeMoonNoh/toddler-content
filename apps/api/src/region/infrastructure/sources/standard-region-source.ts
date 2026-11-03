import { RegionSource } from '../../application/ports/region-source';
import { NATIONWIDE_CODE, type Region } from '../../domain/region';

import type { HttpClient } from '../../../shared/infrastructure/http-client';
import type { ServiceKey } from '../../../shared/infrastructure/service-key';

const LIST_URL = 'https://apis.data.go.kr/1741000/StanReginCd/getStanReginCdList';
const PAGE_SIZE = 1000;
const OK = 'INFO-0';

export interface StandardRegionRow {
  region_cd: string;
  umd_cd: string;
  ri_cd: string;
  locatadd_nm: string;
  locallow_nm: string;
  locathigh_cd: string;
}

export class RegionFormatError extends Error {}

// 행정안전부 행정표준코드 법정동코드 API. 읍·면·동, 리까지 2만 건이 넘게 오지만 시·도와 시·군·구만 쓴다
export class StandardRegionSource extends RegionSource {
  readonly name = '행정안전부 행정표준코드(법정동코드)';

  constructor(
    private readonly http: HttpClient,
    private readonly key: ServiceKey,
  ) {
    super();
  }

  async fetchAll(): Promise<Region[]> {
    const first = await this.fetchPage(1);
    const pages = Math.ceil(first.totalCount / PAGE_SIZE);
    const rows = [...first.rows];
    for (let page = 2; page <= pages; page++) rows.push(...(await this.fetchPage(page)).rows);
    return toRegions(rows);
  }

  private async fetchPage(page: number) {
    const url = new URL(LIST_URL);
    url.searchParams.set('pageNo', String(page));
    url.searchParams.set('numOfRows', String(PAGE_SIZE));
    url.searchParams.set('type', 'json');
    return parsePage(await this.http.getText(this.key.signed(url)));
  }
}

export function parsePage(text: string): { totalCount: number; rows: StandardRegionRow[] } {
  let json: Record<string, unknown>;
  try {
    json = JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new RegionFormatError(`법정동코드: JSON이 아닌 응답입니다 (${text.slice(0, 200)})`);
  }
  const gatewayError = (json.OpenAPI_ServiceResponse as { cmmMsgHeader?: { returnAuthMsg?: string; errMsg?: string } } | undefined)
    ?.cmmMsgHeader;
  if (gatewayError) throw new RegionFormatError(`법정동코드: ${gatewayError.returnAuthMsg ?? gatewayError.errMsg ?? '알 수 없는 오류'}`);

  const [head, body] = (json.StanReginCd ?? []) as [{ head?: Record<string, unknown>[] }?, { row?: StandardRegionRow[] }?];
  const info = Object.assign({}, ...(head?.head ?? [])) as { totalCount?: number; RESULT?: { resultCode?: string; resultMsg?: string } };
  if (info.RESULT?.resultCode !== OK) throw new RegionFormatError(`법정동코드: ${info.RESULT?.resultMsg ?? '예상과 다른 응답입니다'}`);
  if (typeof info.totalCount !== 'number') throw new RegionFormatError('법정동코드: 전체 건수를 읽을 수 없습니다');
  return { totalCount: info.totalCount, rows: body?.row ?? [] };
}

// 시·도, 시·군·구 줄만 지역으로 바꾼다.
// NOTE: 일반구(청주시 상당구 등)는 원본의 상위 코드가 시가 아니라 도라서, 이름으로 시를 찾아 그 아래에 둔다
export function toRegions(rows: StandardRegionRow[]): Region[] {
  const upper = rows.filter((row) => row.umd_cd === '000' && row.ri_cd === '00');
  const codeByFullName = new Map(upper.map((row) => [row.locatadd_nm.trim(), row.region_cd]));
  const regions = upper.map((row) => {
    const fullName = row.locatadd_nm.trim();
    const cityName = fullName.split(' ').slice(0, -1).join(' ');
    const parentCode = (fullName.split(' ').length > 2 && codeByFullName.get(cityName)) || row.locathigh_cd;
    return { code: row.region_cd, name: row.locallow_nm.trim(), fullName, parentCode };
  });
  return [
    { code: NATIONWIDE_CODE, name: '전국', fullName: '전국', parentCode: null },
    ...regions.sort((a, b) => a.code.localeCompare(b.code)),
  ];
}
