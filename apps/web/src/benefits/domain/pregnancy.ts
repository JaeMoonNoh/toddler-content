import type { CalendarDate } from './calendar-date';
import { type ChildDates, PREGNANCY_DAYS } from './child-dates';

export type ChildStage =
  | { kind: 'pregnant'; weeks: number; days: number; daysUntilDue: number }
  | { kind: 'after-due'; daysSinceDue: number } // 출산예정일이 지났는데 출생일을 아직 안 넣음
  | { kind: 'too-far'; daysUntilDue: number } // 출산예정일이 40주보다 더 뒤
  | { kind: 'born'; daysSinceBirth: number; months: number }
  | { kind: 'birth-in-future' }; // 출생일을 오늘보다 뒤로 넣음

export function childStage(dates: ChildDates, today: CalendarDate): ChildStage {
  return dates.birth ? bornStage(dates.birth, today) : pregnancyStage(dates.due, today);
}

function bornStage(birth: CalendarDate, today: CalendarDate): ChildStage {
  if (birth.isAfter(today)) return { kind: 'birth-in-future' };
  return { kind: 'born', daysSinceBirth: today.daysSince(birth), months: monthsBetween(birth, today) };
}

function pregnancyStage(due: CalendarDate, today: CalendarDate): ChildStage {
  const daysUntilDue = due.daysSince(today);
  if (daysUntilDue < 0) return { kind: 'after-due', daysSinceDue: -daysUntilDue };

  const elapsed = PREGNANCY_DAYS - daysUntilDue;
  if (elapsed < 0) return { kind: 'too-far', daysUntilDue };
  return { kind: 'pregnant', weeks: Math.floor(elapsed / 7), days: elapsed % 7, daysUntilDue };
}

// 생일이 돌아온 달만 센다 (1월 31일생은 2월 28일이 아니라 3월 1일에 1개월)
function monthsBetween(birth: CalendarDate, today: CalendarDate): number {
  let months = 0;
  while (!birth.addMonths(months + 1).isAfter(today)) months++;
  return months;
}

// 일정을 계산할 수 있는 단계인지. 날짜가 이상하면 일정을 보여주지 않는다
export function hasSchedule(stage: ChildStage): boolean {
  return stage.kind !== 'too-far' && stage.kind !== 'birth-in-future';
}

export function describeStage(stage: ChildStage): string {
  switch (stage.kind) {
    case 'pregnant':
      return stage.daysUntilDue === 0
        ? '오늘이 출산예정일이에요'
        : `임신 ${stage.weeks}주 ${stage.days}일 · 출산까지 ${stage.daysUntilDue}일`;
    case 'after-due':
      return `출산예정일로부터 ${stage.daysSinceDue}일 지났어요. 태어났다면 출생일을 넣어 주세요`;
    case 'too-far':
      return '출산예정일이 40주보다 뒤예요. 날짜를 확인해 주세요';
    case 'born':
      return stage.months === 0 ? `태어난 지 ${stage.daysSinceBirth}일` : `태어난 지 ${stage.daysSinceBirth}일 · ${stage.months}개월`;
    case 'birth-in-future':
      return '출생일이 오늘보다 뒤예요. 날짜를 확인해 주세요';
  }
}
