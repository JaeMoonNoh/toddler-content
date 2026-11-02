import { SCOPE_LABEL, type BenefitScope, type PublishedBenefit } from './benefit';

export interface Region {
  id: string;
  label: string;
  scopes: BenefitScope[]; // 가까운 지역부터
}

export const REGIONS: Region[] = [
  { id: 'cheongju', label: '충청북도 청주시', scopes: ['cheongju', 'chungbuk', 'national'] },
  { id: 'chungbuk', label: '충청북도 (청주 외 시·군)', scopes: ['chungbuk', 'national'] },
  { id: 'other', label: '다른 지역 (전국 공통만)', scopes: ['national'] },
];

export interface BenefitGroup {
  scope: BenefitScope;
  label: string;
  benefits: PublishedBenefit[];
}

// 사는 곳에서 받을 수 있는 혜택을 가까운 지역부터 묶는다. 빈 묶음은 뺀다
export function groupForRegion(region: Region, benefits: PublishedBenefit[]): BenefitGroup[] {
  return region.scopes
    .map((scope) => ({
      scope,
      label: SCOPE_LABEL[scope],
      benefits: benefits.filter((b) => b.scope === scope).sort((a, b) => a.name.localeCompare(b.name, 'ko')),
    }))
    .filter((group) => group.benefits.length > 0);
}
