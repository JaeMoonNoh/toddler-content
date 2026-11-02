export type BenefitScope = 'national' | 'chungbuk' | 'cheongju';
export type ReviewStatus = 'VERIFIED' | 'UNVERIFIED' | 'SOURCE_CHANGED';

// GET /benefits 응답 한 건
export interface PublishedBenefit {
  slug: string;
  name: string;
  scope: BenefitScope;
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string | null;
  reviewStatus: ReviewStatus;
}

export const SCOPE_LABEL: Record<BenefitScope, string> = {
  cheongju: '청주시',
  chungbuk: '충청북도',
  national: '전국 공통',
};

export interface ReviewBadge {
  tone: 'verified' | 'unverified' | 'changed';
  text: string;
}

// 최종 확인일은 한국 날짜로 보여준다
export function reviewBadge(benefit: PublishedBenefit): ReviewBadge {
  const verifiedOn = benefit.verifiedAt ? koreanDate(benefit.verifiedAt) : null;
  switch (benefit.reviewStatus) {
    case 'VERIFIED':
      return { tone: 'verified', text: `최종 확인 ${verifiedOn}` };
    case 'SOURCE_CHANGED':
      return { tone: 'changed', text: `출처 내용이 바뀌어 다시 확인 중 (마지막 확인 ${verifiedOn})` };
    case 'UNVERIFIED':
      return { tone: 'unverified', text: '검증 전' };
  }
}

function koreanDate(iso: string) {
  return new Date(iso).toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }).replaceAll('-', '.');
}
