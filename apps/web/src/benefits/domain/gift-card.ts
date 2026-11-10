import { receiptOf } from './amount';
import { koreanDate, type PublishedBenefit } from './benefit';
import type { Household } from './eligibility';
import type { RegionChoice } from './region';

const SHOWN_LINES = 4; // 카드에 이름까지 적는 혜택 수. 나머지는 "외 N건"
const BIRTH_ORDER_LABELS = ['첫째', '둘째', '셋째 이상'];

export interface GiftLine {
  name: string;
  won: number;
}

// 공유용 "우리 아이 축하 선물" 카드. 재미로 나누는 카드라도 숫자는 사이트의 합계 규칙을 그대로 따른다
export interface GiftCard {
  total: number;
  lines: GiftLine[]; // 많이 받는 순서
  moreCount: number;
  basis: string; // 어디·몇째 기준인지
  source: string; // 출처와 최종 확인일
}

// 몇째인지 답하지 않았으면 첫째로 본다. 답에 따라 빠질 수 있는 금액과 검증 전 금액은 넣지 않는다
export function giftCardOf(benefits: PublishedBenefit[], household: Household, region: RegionChoice): GiftCard | null {
  const birthOrder = household.birthOrder ?? 1;
  const sure = receiptOf(benefits, { ...household, birthOrder }).lines.filter(
    ({ benefit, onlyIf }) => onlyIf.length === 0 && benefit.reviewStatus === 'VERIFIED',
  );
  if (sure.length === 0) return null;

  const lines = sure.map(({ benefit, range }) => ({ name: benefit.name, won: range.min }));
  return {
    total: lines.reduce((sum, line) => sum + line.won, 0),
    lines: lines.slice(0, SHOWN_LINES),
    moreCount: Math.max(0, lines.length - SHOWN_LINES),
    basis: `${region.place.fullName} · ${BIRTH_ORDER_LABELS[birthOrder - 1]} 기준 · 몇 년에 걸쳐 받는 금액이에요`,
    source: sourceOf(sure.map(({ benefit }) => benefit)),
  };
}

function sourceOf(benefits: PublishedBenefit[]): string {
  const names = [...new Set(benefits.map((b) => b.sourceName))].join(', ');
  const latest = benefits.map((b) => b.verifiedAt).filter((at): at is string => at !== null).sort().at(-1);
  return latest ? `출처: ${names} (${koreanDate(latest)} 확인)` : `출처: ${names}`;
}
