// 어디서 어떻게 신청하는지 한 줄로 (예: "주민센터 방문 또는 정부24 온라인 · 문의 129")

export interface HowToApply {
  summary: string;
  basis: { text: string; url: string };
}

export function howToApplyProblems(howToApply: HowToApply): string[] {
  return [
    !howToApply.summary.trim() && '신청 방법 설명이 비어 있습니다',
    !howToApply.basis.text.trim() && '신청 방법의 근거 문장이 비어 있습니다',
    !howToApply.basis.url.startsWith('https://') && `신청 방법 근거 링크는 https 주소여야 합니다: "${howToApply.basis.url}"`,
  ].filter((problem): problem is string => Boolean(problem));
}

export function sameHowToApply(a: HowToApply | null, b: HowToApply | null) {
  const key = (h: HowToApply | null) => (h ? JSON.stringify([h.summary, h.basis.text, h.basis.url]) : 'null');
  return key(a) === key(b);
}
