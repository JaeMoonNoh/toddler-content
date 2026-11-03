import { XMLParser } from 'fast-xml-parser';

import { type Page, SourceFormatError } from '../paged-source-fetcher';

export type BokjiroItem = Record<string, string>;

export class SourceApiError extends Error {}

const parser = new XMLParser({
  parseTagValue: false, // ID나 코드의 앞자리 0이 사라지지 않게 모든 값을 문자열로 둔다
  isArray: (name) => name === 'servList', // 항목이 1건이어도 배열로 받는다
});

// 복지로 API의 XML 응답. 정상 응답(wantedList)과 공공데이터포털 게이트웨이 오류(OpenAPI_ServiceResponse)를 구분한다.
export function parseBokjiroPage(xml: string, source: string): Page<BokjiroItem> {
  const doc = parseXml(xml, source);

  const gatewayError = doc.OpenAPI_ServiceResponse?.cmmMsgHeader;
  if (gatewayError) {
    throw new SourceApiError(
      `${source}: ${gatewayError.returnAuthMsg ?? gatewayError.errMsg ?? '알 수 없는 오류'} (코드 ${gatewayError.returnReasonCode ?? '-'})`,
    );
  }

  const list = doc.wantedList;
  if (!list) throw new SourceFormatError(`${source}: 예상과 다른 응답입니다 (${xml.slice(0, 200)})`);
  if (list.resultCode !== undefined && list.resultCode !== '0') {
    throw new SourceApiError(`${source}: ${list.resultMessage ?? '오류'} (코드 ${list.resultCode})`);
  }

  const totalCount = Number(list.totalCount);
  if (!Number.isInteger(totalCount) || totalCount < 0) {
    throw new SourceFormatError(`${source}: 전체 건수를 읽을 수 없습니다 (${list.totalCount})`);
  }
  return { items: (list.servList ?? []) as BokjiroItem[], totalCount };
}

function parseXml(xml: string, source: string): any {
  if (!xml.trim().startsWith('<')) throw new SourceFormatError(`${source}: XML이 아닌 응답입니다 (${xml.slice(0, 200)})`);
  return parser.parse(xml);
}
