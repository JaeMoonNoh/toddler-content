import type { Payload } from '../../shared/domain/comparison-rule';

import type { HowToApply } from './how-to-apply';
import type { SourceRef } from './source-ref';

// 원문의 신청방법·접수기관·전화문의로 신청 방법 한 줄 초안을 만든다. 대조를 거쳐 확정한다

const METHOD: Record<string, string> = { 방문신청: '방문', '기타 온라인신청': '온라인', 정부24온라인신청: '정부24 온라인' };
const WAY_ORDER = ['방문', '정부24 온라인', '온라인', '전화'];
const PLACE_ALIAS: Record<string, string> = { '읍면동 주민센터': '주민센터', '읍면동 행정복지센터': '주민센터' };
const MAX_PLACE_LENGTH = 20;
const MAX_QUOTED_METHODS = 3;
const NOT_REQUIRED = '신청불필요';

// 지역번호가 하나뿐인 시·도. 원문에 지역번호 없이 적힌 번호에 붙인다.
// NOTE: 경기는 시마다 지역번호(031·032·02)가 달라 여기에 넣지 않는다. 그런 번호는 쓰지 않는다
const AREA_CODE: Record<string, string> = {
  '11': '02',
  '26': '051',
  '27': '053',
  '28': '032',
  '29': '062',
  '30': '042',
  '31': '052',
  '36': '044',
  '43': '043',
  '44': '041',
  '46': '061',
  '47': '054',
  '48': '055',
  '50': '064',
  '51': '033',
  '52': '063',
};
const SHORT_NUMBERS = ['110', '120', '129'];
// 서울 원문은 다산콜센터를 "02-120"으로 적는다. 다른 시·도의 "031-120" 같은 번호는 120으로 바꾸면 다른 곳에 걸릴 수 있어 그대로 둔다
const SEOUL_CALL_CENTER = '02-120';

export interface DraftSource {
  ref: SourceRef;
  payload: Payload;
}

export function draftHowToApply(sources: DraftSource[], url: string, regionCode: string): HowToApply | null {
  // NOTE: 보건소 여러 곳의 원본을 합친 카드에 첫 원본 번호만 쓰면 다른 지역 사람에게 틀린 번호가 된다
  const phoneAllowed = sources.filter(({ ref }) => ref.source === 'GOV24').length <= 1;
  for (const { ref, payload } of sources) {
    const draft = ref.source === 'GOV24' ? fromGov24(payload, phoneAllowed ? phoneOf(payload, regionCode) : null) : fromBokjiro(payload);
    if (draft) return { summary: draft.summary, basis: { text: draft.basis, url } };
  }
  return null;
}

function fromGov24(payload: Payload, phone: string | null) {
  const methods = listOf(payload, '신청방법');
  const tail = phone ? ` · 문의 ${phone}` : '';
  const basis = [quote('신청방법', payload, MAX_QUOTED_METHODS), quote('접수기관', payload, 1), quote('전화문의', payload, 1)]
    .filter(Boolean)
    .join(' / ');
  if (methods.includes(NOT_REQUIRED)) return { summary: `따로 신청하지 않아도 돼요${tail}`, basis };
  const ways = ordered(methods.map((method) => METHOD[method]).filter(Boolean));
  if (!ways.length) return null;
  const place = shortPlace(textOf(payload, '접수기관'));
  return { summary: `${place ? `${place} ` : ''}${ways.join(' 또는 ')}${tail}`, basis };
}

function fromBokjiro(payload: Payload) {
  const raw = textOf(payload, 'aplyMtdNm');
  const ways = ordered(
    raw
      .split(/[,\s]+/)
      .map((way) => (way === '인터넷' ? '온라인' : way))
      .filter((way) => WAY_ORDER.includes(way)),
  );
  return ways.length ? { summary: ways.join(' 또는 '), basis: `신청방법: ${raw}` } : null;
}

// 전화문의가 여러 곳이면 고르지 않는다. 시·도 전체 혜택에 시·군·구별 번호가 나열된 경우 하나를 고르면 다른 곳 사람에게 틀린 번호가 된다
function phoneOf(payload: Payload, regionCode: string): string | null {
  const phones = listOf(payload, '전화문의');
  if (phones.length !== 1) return null;
  const number = phones[0].split('/').at(-1)!.trim();
  const areaCode = AREA_CODE[regionCode.slice(0, 2)];
  const full = areaCode && /^[2-9]\d{2,3}-\d{4}$/.test(number) ? `${areaCode}-${number}` : number;
  if (full === SEOUL_CALL_CENTER) return '120';
  return isRealPhone(full) ? full : null;
}

function isRealPhone(number: string) {
  return /^0\d{1,2}-\d{3,4}-\d{4}$/.test(number) || /^1\d{3}(-\d{4})?$/.test(number) || SHORT_NUMBERS.includes(number);
}

function ordered(ways: string[]) {
  const unique = new Set(ways);
  if (unique.has('정부24 온라인')) unique.delete('온라인');
  return [...unique].sort((a, b) => WAY_ORDER.indexOf(a) - WAY_ORDER.indexOf(b));
}

function shortPlace(raw: string) {
  const place = PLACE_ALIAS[raw] ?? raw;
  return place && place !== '직접입력' && !place.includes('온라인') && place.length <= MAX_PLACE_LENGTH ? place : null;
}

function quote(label: string, payload: Payload, max: number) {
  const parts = listOf(payload, label);
  if (!parts.length) return null;
  return `${label}: ${parts.slice(0, max).join(', ')}${parts.length > max ? ' 외' : ''}`;
}

// 보조금24는 여러 값을 "||"로 이어 준다
function listOf(payload: Payload, field: string) {
  return textOf(payload, field).split('||').filter(Boolean);
}

function textOf(payload: Payload, field: string) {
  const value = payload[field];
  return typeof value === 'string' ? value.trim() : '';
}
