import type { Payload } from '../../../shared/domain/comparison-rule';
import type { SourceId } from '../../../shared/domain/source-id';
import type { CardToPlan } from '../../application/benefit-plan.service';

// 일정·금액을 정할 때 읽는 원문 필드 [원본 필드, 보여줄 이름]
const PLAN_FIELDS: Record<SourceId, [string, string][]> = {
  GOV24: [
    ['신청기한', '신청기한'],
    ['지원대상', '지원대상'],
    ['선정기준', '선정기준'],
    ['지원내용', '지원내용'],
    ['신청방법', '신청방법'],
  ],
  BOKJIRO_LOCAL: [
    ['servDgst', '요약'],
    ['sprtCycNm', '지원주기'],
    ['srvPvsnNm', '제공유형'],
    ['aplyMtdNm', '신청방법'],
  ],
  BOKJIRO_NATIONAL: [
    ['servDgst', '요약'],
    ['trgterIndvdlArray', '대상'],
    ['aplyMtdNm', '신청방법'],
  ],
};
const SOURCE_LABEL: Record<SourceId, string> = { GOV24: '보조금24', BOKJIRO_LOCAL: '복지로 지자체', BOKJIRO_NATIONAL: '복지로 중앙부처' };

// 카드마다 원문 전체를 모아, 일정·금액 초안을 쓰는 사람(또는 subagent)이 읽을 md를 만든다.
// 규칙은 docs/benefit-plan-rules.md에 있고, 여기서는 읽을 내용만 담는다
export function printCardsToPlan(cards: CardToPlan[], title: string): string {
  return [`# ${title} (${cards.length}건)`, '', ...cards.map(toSection)].join('\n');
}

function toSection({ card, sources }: CardToPlan, index: number): string {
  const conditions = card.conditions.length ? ` / 조건: ${card.conditions.join(', ')}` : '';
  return [
    `## ${index + 1}. ${card.name}`,
    `- slug: \`${card.slug}\``,
    `- 지역코드: ${card.regionCode}`,
    `- 원문 링크: ${card.sourceUrl}`,
    `- 대상 묶음: ${card.audience ?? '없음 (누구나)'}${conditions}`,
    '',
    ...sources.map(({ ref, payload }) => toSource(ref.source, ref.externalId, payload)),
  ].join('\n');
}

export function toSource(source: SourceId, externalId: string, payload: Payload | null): string {
  if (!payload) return `### 원문 ${SOURCE_LABEL[source]} ${externalId}: 수집돼 있지 않음\n`;
  return [
    `### 원문 (${SOURCE_LABEL[source]} ${externalId})`,
    ...PLAN_FIELDS[source].map(([field, label]) => `- ${label}: ${clean(payload[field]) || '(없음)'}`),
    '',
  ].join('\n');
}

function clean(value: unknown): string {
  return typeof value === 'string'
    ? value
        .replace(/\r/g, '')
        .replace(/[ \t]+/g, ' ')
        .replace(/ ?\n\s*/g, '\n')
        .trim()
    : '';
}
