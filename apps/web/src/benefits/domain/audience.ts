import type { Audience, PublishedBenefit } from './benefit';

// 화면에 보여주는 순서
const AUDIENCE_ORDER: { audience: Audience; label: string }[] = [
  { audience: 'INFERTILITY', label: '난임·임신 준비' },
  { audience: 'MULTI_CHILD', label: '다자녀·다태아' },
  { audience: 'SICK_CHILD', label: '아이 건강 (미숙아·질환·발달)' },
  { audience: 'LOW_INCOME', label: '기초생활·차상위 등 저소득' },
  { audience: 'SINGLE_TEEN_PARENT', label: '한부모·청소년부모' },
  { audience: 'DISABILITY', label: '장애' },
  { audience: 'ADOPTION_FOSTER', label: '입양·가정위탁' },
  { audience: 'SPECIAL', label: '그 밖의 특정 대상' },
];

export interface AudienceGroup {
  audience: Audience;
  label: string;
  benefits: PublishedBenefit[];
}

export interface AudienceSplit {
  forEveryone: PublishedBenefit[];
  groups: AudienceGroup[]; // 해당하는 사람만 보면 되는 혜택. 빈 묶음은 뺀다
}

export function splitByAudience(benefits: PublishedBenefit[]): AudienceSplit {
  return {
    forEveryone: benefits.filter((b) => b.audience === null),
    groups: AUDIENCE_ORDER.map(({ audience, label }) => ({
      audience,
      label,
      benefits: benefits.filter((b) => b.audience === audience).sort((a, b) => a.name.localeCompare(b.name, 'ko')),
    })).filter((group) => group.benefits.length > 0),
  };
}
