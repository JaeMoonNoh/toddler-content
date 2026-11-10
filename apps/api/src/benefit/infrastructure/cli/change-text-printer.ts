import { DETAIL_FIELD_PREFIX } from '../../domain/benefit';

import { tierText } from './plan-verify-printer';
import { wordDiffExcerpt } from './word-diff';

import type { FieldChange } from '../../../shared/domain/comparison-rule';
import type { ChangedCard } from '../../application/benefit-review.service';
import type { BenefitDetails } from '../../domain/benefit';
import type { ChangedSource } from '../../domain/review-status';

export const CHANGE_RULES_PATH = 'docs/benefit-change-rules.md';
// 판단 subagent 하나가 한 번에 읽기 알맞은 양
const CARDS_PER_FILE = 25;

// 원문 필드 이름 → 사람이 읽는 이름. 보조금24는 이름이 이미 한글이라 없고, 없는 필드는 원래 이름을 쓴다
const FIELD_LABEL: Record<string, string> = {
  alwServCn: '지원내용',
  sprtTrgtCn: '지원대상',
  tgtrDtlCn: '지원대상',
  slctCritCn: '선정기준',
  aplyMtdCn: '신청방법',
  aplyMtdNm: '신청방법(요약)',
  applmetList: '신청방법 목록',
  enfcBgngYmd: '사업 기간(시작)',
  enfcEndYmd: '사업 기간(끝)',
  servNm: '서비스 이름',
  servDgst: '요약',
  wlfareInfoOutlCn: '개요',
  sprtCycNm: '지원주기',
  srvPvsnNm: '제공유형',
  inqplCtadrList: '문의처',
  rprsCtadr: '대표 문의처',
  bizChrDeptNm: '담당 부서',
  jurMnofNm: '소관 부처',
};

export interface ChangeTextFile {
  name: string;
  text: string;
}

// 원본이 바뀐 카드마다 지금 카드 값과 바뀐 말만 모아, 카드를 고쳐야 하는지 판단할 subagent가 읽을 md를 나눠 만든다.
// 원문 전체 대신 바뀐 곳 앞뒤만 넣어 읽는 양을 줄인다. 판단 규칙은 docs/benefit-change-rules.md에 있다
export function toChangeTextFiles(items: ChangedCard[], regionNames: Map<string, string>, size = CARDS_PER_FILE): ChangeTextFile[] {
  const total = Math.ceil(items.length / size);
  return Array.from({ length: total }, (_, part) => ({
    name: `changes-${part + 1}.md`,
    text: printChangeTexts(items.slice(part * size, (part + 1) * size), `원본 바뀜 판단 ${part + 1}/${total}`, regionNames),
  }));
}

function printChangeTexts(items: ChangedCard[], title: string, regionNames: Map<string, string>): string {
  return [
    `# ${title} (${items.length}건)`,
    '',
    `판단 규칙: ${CHANGE_RULES_PATH}. 표기: [-지운 말-]{+더한 말+}, …는 바뀌지 않아 줄인 부분`,
    '',
    ...items.map((item, index) => toSection(item, index, regionNames)),
  ].join('\n');
}

export function fieldCountOf(items: ChangedCard[]): number {
  return items.reduce((sum, { changes }) => sum + changes.reduce((n, { fields }) => n + fields.length, 0), 0);
}

function toSection({ card, changes }: ChangedCard, index: number, regionNames: Map<string, string>): string {
  const region = regionNames.get(card.regionCode);
  return [
    `## ${index + 1}. ${card.name}`,
    `- slug: \`${card.slug}\``,
    `- 지역: ${region ? `${region} (${card.regionCode})` : card.regionCode}`,
    `- 원문 링크: ${card.sourceUrl}`,
    '',
    '### 지금 카드 값',
    ...cardValueLines(card),
    '',
    ...changes.flatMap(changeLines),
  ].join('\n');
}

function cardValueLines({ amount, schedule, applicationPeriod, howToApply, audience, conditions }: BenefitDetails): string[] {
  return [
    `- 금액(amount): ${amount ? `${amount.summary} / 합계: ${amount.tiers ? amount.tiers.map(tierText).join(', ') : '제외'}` : '없음'}`,
    `- 일정(schedule): ${schedule ? `${schedule.summary} (${schedule.untilLabel})` : '없음'}`,
    `- 올해 신청 기간(applicationPeriod): ${applicationPeriod ? `${applicationPeriod.start} ~ ${applicationPeriod.end}` : '없음'}`,
    `- 신청 방법(howToApply): ${howToApply?.summary ?? '없음'}`,
    `- 대상 묶음(audience): ${audience ?? '없음 (누구나)'}`,
    `- 조건(conditions): ${conditions.length ? conditions.join(', ') : '없음'}`,
  ];
}

function changeLines({ ref, fields }: ChangedSource): string[] {
  return [`### 바뀐 원문 (${ref.label} ${ref.externalId})`, ...fields.map(fieldLine), ''];
}

function fieldLine({ field, before, after }: FieldChange): string {
  return `- ${labelOf(field)}: ${wordDiffExcerpt(before, after) ?? '띄어쓰기·줄바꿈만 바뀜'}`;
}

function labelOf(field: string): string {
  const isDetail = field.startsWith(DETAIL_FIELD_PREFIX);
  const name = isDetail ? field.slice(DETAIL_FIELD_PREFIX.length) : field;
  const label = FIELD_LABEL[name] ?? name;
  return isDetail ? `${label} (상세 ${name})` : label === name ? name : `${label} (${name})`;
}
