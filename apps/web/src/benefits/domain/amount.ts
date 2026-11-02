import type { BenefitAmount, PublishedBenefit } from './benefit';

export interface WonRange {
  min: number;
  max: number;
}

// 몇째인지 모르면 가장 적은 구간과 가장 많은 구간을 범위로 돌려준다. 금액을 정할 수 없는 혜택은 null
export function amountRange(amount: BenefitAmount, birthOrder: number | null): WonRange | null {
  if (!amount.tiers) return null;
  const tiers = birthOrder === null ? amount.tiers : amount.tiers.filter((t) => covers(t, birthOrder));
  const won = tiers.map((t) => t.won);
  return { min: Math.min(...won), max: Math.max(...won) };
}

function covers({ minBirthOrder, maxBirthOrder }: { minBirthOrder: number; maxBirthOrder: number | null }, order: number) {
  return order >= minBirthOrder && (maxBirthOrder === null || order <= maxBirthOrder);
}

export interface AmountLine {
  benefit: PublishedBenefit;
  range: WonRange;
}

export interface AmountReceipt {
  lines: AmountLine[]; // 많이 받는 순서
  total: WonRange;
  notCounted: PublishedBenefit[]; // 금액이 소득·임금에 따라 달라서 합계에서 뺀 혜택
}

export function receiptOf(benefits: PublishedBenefit[], birthOrder: number | null): AmountReceipt {
  const withAmount = benefits.filter((b): b is PublishedBenefit & { amount: BenefitAmount } => b.amount !== null);
  const lines = withAmount
    .flatMap((benefit) => {
      const range = amountRange(benefit.amount, birthOrder);
      return range ? { benefit, range } : [];
    })
    .sort((a, b) => b.range.max - a.range.max || a.benefit.name.localeCompare(b.benefit.name, 'ko'));
  const total = lines.reduce((sum, { range }) => ({ min: sum.min + range.min, max: sum.max + range.max }), { min: 0, max: 0 });
  return { lines, total, notCounted: withAmount.filter((b) => !b.amount.tiers) };
}

// 2000000 → "200만원", 12500000 → "1,250만원", 15000 → "1만 5,000원"
export function formatWon(won: number): string {
  const man = Math.floor(won / 10_000);
  const rest = won % 10_000;
  if (man === 0) return `${rest.toLocaleString('ko-KR')}원`;
  return rest === 0 ? `${man.toLocaleString('ko-KR')}만원` : `${man.toLocaleString('ko-KR')}만 ${rest.toLocaleString('ko-KR')}원`;
}

export function formatRange({ min, max }: WonRange): string {
  return min === max ? formatWon(min) : `${formatWon(min).replace(/원$/, '')} ~ ${formatWon(max)}`;
}
