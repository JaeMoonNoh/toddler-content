import { type ApplicationPeriod, periodProblems } from './application-period';
import { amountProblems, type BenefitAmount } from './benefit-amount';
import { type BenefitSchedule, scheduleProblems } from './benefit-schedule';

import type { BenefitDetails } from './benefit';

// 합계에 넣으면 안 되는, 정해지지 않은 금액을 뜻하는 말
const UNFIXED_AMOUNT = /최대|이내|까지|차등|실비/;

// 원문을 읽고 정리한 혜택 한 건의 일정·금액·올해 신청 기간 초안. 검사를 통과하면 혜택 목록에 넣는다
export class BenefitPlan {
  constructor(
    readonly slug: string,
    readonly schedule: BenefitSchedule | null,
    readonly amount: BenefitAmount | null,
    readonly applicationPeriod: ApplicationPeriod | null,
    readonly note: string, // 판단이 애매했던 점. 사람이 PR에서 본다
  ) {}

  // year: 올해 (YYYY). 올해 신청 기간은 올해 것만 받는다
  problemsFor(card: BenefitDetails, year: string): string[] {
    return [
      ...(this.schedule ? [...scheduleProblems(this.schedule), ...this.basisProblems('schedule', this.schedule.basis.url, card)] : []),
      ...(this.amount
        ? [...amountProblems(this.amount), ...this.basisProblems('amount', this.amount.basis.url, card), ...this.tierProblems(card)]
        : []),
      ...(this.applicationPeriod
        ? [
            ...periodProblems(this.applicationPeriod),
            ...this.basisProblems('applicationPeriod', this.applicationPeriod.basis.url, card),
            ...this.yearProblems(year),
          ]
        : []),
    ];
  }

  // today: 정리한 날 (YYYY-MM-DD). 정할 것이 없어서 세 값이 모두 null이어도 정리한 카드로 남는다
  applyTo(card: BenefitDetails, today: string): BenefitDetails {
    return { ...card, schedule: this.schedule, amount: this.amount, applicationPeriod: this.applicationPeriod, plannedOn: today };
  }

  private basisProblems(field: string, url: string, card: BenefitDetails): string[] {
    return url === card.sourceUrl ? [] : [`${field}의 근거 링크가 혜택의 원문 링크와 다릅니다`];
  }

  // 합계는 누구나 받는 정해진 금액만 더한다. 특정 대상이나 조건이 있는 혜택까지 더하면 대부분의 사람에게 부풀려진 합계가 된다
  private tierProblems(card: BenefitDetails): string[] {
    if (!this.amount?.tiers) return [];
    const unfixed = this.amount.summary.match(UNFIXED_AMOUNT)?.[0];
    return [
      card.audience !== null && `대상 묶음(${card.audience})이 있는 혜택은 합계 금액(tiers)을 null로 둡니다`,
      card.conditions.length > 0 && `조건(${card.conditions.join(', ')})이 있는 혜택은 합계 금액(tiers)을 null로 둡니다`,
      this.amount.kind === 'service' && '서비스는 합계 금액(tiers)을 null로 둡니다',
      unfixed && `금액 설명에 "${unfixed}"가 있는데 합계 금액(tiers)을 채웠습니다. 정해진 금액인지 확인해 주세요`,
    ].filter((problem): problem is string => Boolean(problem));
  }

  private yearProblems(year: string): string[] {
    const { start, end } = this.applicationPeriod!;
    return start.startsWith(year) || end.startsWith(year) ? [] : [`올해(${year}) 신청 기간이 아닙니다: ${start} ~ ${end}`];
  }
}
