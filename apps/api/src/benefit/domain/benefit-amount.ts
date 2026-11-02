// 혜택으로 받는 금액. 출생 순위에 따라 달라지는 금액을 구간으로 나눠 적는다

export const AMOUNT_KINDS = ['cash', 'voucher', 'service', 'wage'] as const;
export type AmountKind = (typeof AMOUNT_KINDS)[number]; // 현금, 바우처(이용권), 서비스, 임금 대신 받는 급여

// 출생 순위 minBirthOrder ~ maxBirthOrder(null이면 끝없음)번째 아이일 때 받는 총액
export interface AmountTier {
  minBirthOrder: number;
  maxBirthOrder: number | null;
  won: number;
}

export interface BenefitAmount {
  kind: AmountKind;
  summary: string; // 사람이 읽는 한 줄. 예: "첫째 200만원, 둘째 이상 300만원"
  tiers: AmountTier[] | null; // 합계에 넣을 수 있는 금액. 소득이나 임금에 따라 달라서 정할 수 없으면 null
  basis: { text: string; url: string };
}

export function amountProblems(amount: BenefitAmount): string[] {
  return [
    !(AMOUNT_KINDS as readonly string[]).includes(amount.kind) && `알 수 없는 금액 종류입니다: "${amount.kind}"`,
    !amount.summary.trim() && '금액 설명이 비어 있습니다',
    !amount.basis.text.trim() && '금액의 근거 문장이 비어 있습니다',
    !amount.basis.url.startsWith('https://') && `금액 근거 링크는 https 주소여야 합니다: "${amount.basis.url}"`,
    ...(amount.tiers ? tierProblems(amount.tiers) : []),
  ].filter((problem): problem is string => Boolean(problem));
}

// 구간은 첫째부터 시작해 빈틈과 겹침 없이 이어지고, 마지막 구간은 끝이 없어야 한다
function tierProblems(tiers: AmountTier[]): string[] {
  if (tiers.length === 0) return ['금액 구간이 비어 있습니다'];
  const problems: string[] = [];
  if (tiers.some((t) => !Number.isInteger(t.won) || t.won <= 0)) problems.push('금액은 1원 이상의 정수여야 합니다');

  let expected = 1;
  for (const [index, tier] of tiers.entries()) {
    const isLast = index === tiers.length - 1;
    if (tier.minBirthOrder !== expected) {
      problems.push(`금액 구간이 ${expected}번째 아이부터 이어지지 않습니다`);
      break;
    }
    if (isLast ? tier.maxBirthOrder !== null : tier.maxBirthOrder === null || tier.maxBirthOrder < tier.minBirthOrder) {
      problems.push(isLast ? '마지막 금액 구간은 끝이 없어야 합니다 (maxBirthOrder: null)' : '중간 금액 구간의 끝이 잘못됐습니다');
      break;
    }
    expected = (tier.maxBirthOrder ?? 0) + 1;
  }
  return problems;
}

export function sameAmount(a: BenefitAmount | null, b: BenefitAmount | null) {
  return canonical(a) === canonical(b);
}

function canonical(amount: BenefitAmount | null) {
  if (!amount) return 'null';
  const tiers = amount.tiers?.map((t) => [t.minBirthOrder, t.maxBirthOrder, t.won]) ?? null;
  return JSON.stringify([amount.kind, amount.summary, tiers, amount.basis.text, amount.basis.url]);
}
