import { XMLParser } from 'fast-xml-parser';

import { type Page, SourceFormatError } from '../paged-source-fetcher';

export type BokjiroItem = Record<string, string>;
// 상세는 문자열 필드와, 문의처·서식·근거법령처럼 같은 태그가 여러 번 오는 목록 필드가 섞여 있다
export type BokjiroDetail = Record<string, string | Record<string, string>[]>;

export class SourceApiError extends Error {}

// parseTagValue: false라서 값은 모두 문자열이다. 실제로 오는지는 아래에서 하나씩 확인한다
interface BokjiroDocument {
  OpenAPI_ServiceResponse?: { cmmMsgHeader?: { returnAuthMsg?: string; errMsg?: string; returnReasonCode?: string } };
  wantedList?: { resultCode?: string; resultMessage?: string; totalCount?: string; servList?: BokjiroItem[] };
  wantedDtl?: BokjiroDetail & { resultCode?: string; resultMessage?: string };
}

const parser = new XMLParser({
  parseTagValue: false, // ID나 코드의 앞자리 0이 사라지지 않게 모든 값을 문자열로 둔다
  isArray: (name) => name === 'servList', // 항목이 1건이어도 배열로 받는다
});

// NOTE: 상세의 목록 필드(inqplCtadrList, basfrmList 등)는 1건이면 객체, 여러 건이면 배열로 온다.
// 건수만 바뀌어도 모양이 달라져 변경으로 잡히지 않게 늘 배열로 받는다
const detailParser = new XMLParser({
  parseTagValue: false,
  isArray: (name, jpath) => jpath === `wantedDtl.${name}` && name.endsWith('List'),
});

// 복지로 API의 XML 응답. 정상 응답(wantedList)과 공공데이터포털 게이트웨이 오류(OpenAPI_ServiceResponse)를 구분한다.
export function parseBokjiroPage(xml: string, source: string): Page<BokjiroItem> {
  const doc = parseXml(parser, xml, source);
  const list = doc.wantedList;
  rejectError(doc, list, xml, source);

  const totalCount = Number(list.totalCount);
  if (!Number.isInteger(totalCount) || totalCount < 0) {
    throw new SourceFormatError(`${source}: 전체 건수를 읽을 수 없습니다 (${list.totalCount})`);
  }
  return { items: list.servList ?? [], totalCount };
}

// 복지로 상세 API의 XML 응답 (wantedDtl). 결과 코드와 메시지도 받은 그대로 둔다
export function parseBokjiroDetail(xml: string, source: string): BokjiroDetail {
  const doc = parseXml(detailParser, xml, source);
  const detail = doc.wantedDtl;
  rejectError(doc, detail, xml, source);
  return detail;
}

function parseXml(xmlParser: XMLParser, xml: string, source: string): BokjiroDocument {
  if (!xml.trim().startsWith('<')) throw new SourceFormatError(`${source}: XML이 아닌 응답입니다 (${xml.slice(0, 200)})`);
  return xmlParser.parse(xml) as BokjiroDocument;
}

// 게이트웨이 오류(OpenAPI_ServiceResponse), 예상과 다른 응답, 0이 아닌 결과 코드를 거른다
function rejectError<Body extends { resultCode?: string; resultMessage?: string }>(
  doc: BokjiroDocument,
  body: Body | undefined,
  xml: string,
  source: string,
): asserts body is Body {
  const gatewayError = doc.OpenAPI_ServiceResponse?.cmmMsgHeader;
  if (gatewayError) {
    throw new SourceApiError(
      `${source}: ${gatewayError.returnAuthMsg ?? gatewayError.errMsg ?? '알 수 없는 오류'} (코드 ${gatewayError.returnReasonCode ?? '-'})`,
    );
  }
  if (!body) throw new SourceFormatError(`${source}: 예상과 다른 응답입니다 (${xml.slice(0, 200)})`);
  if (body.resultCode !== undefined && body.resultCode !== '0') {
    throw new SourceApiError(`${source}: ${body.resultMessage ?? '오류'} (코드 ${body.resultCode})`);
  }
}
