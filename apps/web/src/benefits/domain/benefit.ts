export type BenefitScope = 'national' | 'chungbuk' | 'cheongju';
export type ReviewStatus = 'VERIFIED' | 'UNVERIFIED' | 'SOURCE_CHANGED';

export interface ScheduleOffset {
  anchor: 'pregnancy' | 'birth'; // pregnancy: 임신 시작(출산예정일 280일 전), birth: 출생일
  months: number;
  days: number;
}

export interface BenefitSchedule {
  from: ScheduleOffset;
  until: ScheduleOffset;
  untilLabel: string;
  summary: string;
  basis: { text: string; url: string };
}

export type EligibilityCondition =
  | 'BIRTH_PARENT_INSURED'
  | 'PARTNER_INSURED'
  | 'EITHER_PARENT_INSURED'
  | 'BIRTH_PARENT_UNINSURED'
  | 'HOME_CARE'
  | 'USES_CHILDCARE';

export interface AmountTier {
  minBirthOrder: number;
  maxBirthOrder: number | null; // null이면 끝없음
  won: number;
}

export interface BenefitAmount {
  kind: 'cash' | 'voucher' | 'service' | 'wage';
  summary: string;
  tiers: AmountTier[] | null; // 소득이나 임금에 따라 달라서 정할 수 없으면 null
  basis: { text: string; url: string };
}

// 해마다 공고하는 사업의 올해 신청 기간 (실제 날짜)
export interface ApplicationPeriod {
  start: string; // YYYY-MM-DD
  end: string;
  basis: { text: string; url: string };
}

// 어디서 어떻게 신청하는지 한 줄
export interface HowToApply {
  summary: string;
  basis: { text: string; url: string };
}

export type Audience =
  | 'ADOPTION_FOSTER'
  | 'DISABILITY'
  | 'SINGLE_TEEN_PARENT'
  | 'LOW_INCOME'
  | 'MULTI_CHILD'
  | 'INFERTILITY'
  | 'SICK_CHILD'
  | 'SPECIAL';

// GET /benefits 응답 한 건
export interface PublishedBenefit {
  slug: string;
  name: string;
  scope: BenefitScope;
  sourceName: string;
  sourceUrl: string;
  verifiedAt: string | null;
  reviewStatus: ReviewStatus;
  schedule: BenefitSchedule | null;
  conditions: EligibilityCondition[];
  amount: BenefitAmount | null;
  applicationPeriod: ApplicationPeriod | null;
  howToApply: HowToApply | null;
  audience: Audience | null; // 특정 대상만 받는 혜택의 묶음. 누구나 받으면 null
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
