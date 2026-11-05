import { toSource } from './plan-text-printer';

import type { PlanWithSources } from '../../application/benefit-plan.service';
import type { AmountTier } from '../../domain/benefit-amount';
import type { ScheduleOffset } from '../../domain/benefit-schedule';

const ORDINALS = ['', '첫째', '둘째', '셋째', '넷째', '다섯째', '여섯째'];

// 날짜(일정·올해 신청 기간)나 합계 금액이 있는 초안만 대조한다. 틀리면 사용자가 날짜를 놓치거나 합계가 부풀기 때문이다
export function needsCrossCheck({ plan }: PlanWithSources): boolean {
  return Boolean(plan.schedule || plan.applicationPeriod || plan.amount?.tiers);
}

// 초안을 쓰지 않은 검토자가 원문과 나란히 놓고 대조할 md
export function printPlanVerify(items: PlanWithSources[], title: string): string {
  return [`# ${title} (${items.length}건)`, '', ...items.map(toSection)].join('\n');
}

function toSection({ plan, card, sources }: PlanWithSources, index: number): string {
  const lines = [
    `## ${index + 1}. ${card.name}`,
    `- slug: \`${card.slug}\``,
    `- 원문 링크: ${card.sourceUrl}`,
    `- 대상 묶음: ${card.audience ?? '없음 (누구나)'}`,
    '',
    '### 정리한 값',
  ];
  const { schedule, amount, applicationPeriod } = plan;
  if (schedule)
    lines.push(
      `- 일정: ${offsetText(schedule.from)} ~ ${offsetText(schedule.until)} (${schedule.untilLabel})`,
      `  - 설명: ${schedule.summary}`,
      `  - 근거: ${schedule.basis.text}`,
    );
  if (amount)
    lines.push(
      `- 금액: ${amount.summary}`,
      `  - 합계에 넣는 총액: ${amount.tiers ? amount.tiers.map(tierText).join(', ') : '없음 (합계 제외)'}`,
      `  - 근거: ${amount.basis.text}`,
    );
  if (applicationPeriod)
    lines.push(`- 올해 신청 기간: ${applicationPeriod.start} ~ ${applicationPeriod.end} (근거: ${applicationPeriod.basis.text})`);
  return [...lines, '', ...sources.map(({ ref, payload }) => toSource(ref.source, ref.externalId, payload))].join('\n');
}

function offsetText({ anchor, months, days }: ScheduleOffset): string {
  const base = anchor === 'pregnancy' ? '임신 시작(출산예정일 280일 전)' : '출생일';
  return `${base}${months ? ` + ${months}개월` : ''}${days ? ` ${days > 0 ? '+' : '-'} ${Math.abs(days)}일` : ''}`;
}

function tierText({ minBirthOrder, maxBirthOrder, won }: AmountTier): string {
  const who =
    maxBirthOrder === null
      ? minBirthOrder === 1
        ? '모든 아이'
        : `${ORDINALS[minBirthOrder]} 이상`
      : maxBirthOrder === minBirthOrder
        ? ORDINALS[minBirthOrder]
        : `${ORDINALS[minBirthOrder]}~${ORDINALS[maxBirthOrder]}`;
  return `${who} ${won.toLocaleString('ko-KR')}원`;
}
