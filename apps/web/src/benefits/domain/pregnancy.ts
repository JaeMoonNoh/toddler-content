import type { CalendarDate } from './calendar-date';

const PREGNANCY_DAYS = 280; // 마지막 생리 시작일부터 출산예정일까지

export type PregnancyStage =
  | { kind: 'pregnant'; weeks: number; days: number; daysUntilDue: number }
  | { kind: 'after-due'; daysSinceDue: number }
  | { kind: 'too-far'; daysUntilDue: number }; // 출산예정일이 40주보다 더 뒤

export function pregnancyStage(due: CalendarDate, today: CalendarDate): PregnancyStage {
  const daysUntilDue = due.daysSince(today);
  if (daysUntilDue < 0) return { kind: 'after-due', daysSinceDue: -daysUntilDue };

  const elapsed = PREGNANCY_DAYS - daysUntilDue;
  if (elapsed < 0) return { kind: 'too-far', daysUntilDue };
  return { kind: 'pregnant', weeks: Math.floor(elapsed / 7), days: elapsed % 7, daysUntilDue };
}

export function describeStage(stage: PregnancyStage): string {
  switch (stage.kind) {
    case 'pregnant':
      return stage.daysUntilDue === 0
        ? '오늘이 출산예정일이에요'
        : `임신 ${stage.weeks}주 ${stage.days}일 · 출산까지 ${stage.daysUntilDue}일`;
    case 'after-due':
      return `출산예정일로부터 ${stage.daysSinceDue}일 지났어요`;
    case 'too-far':
      return '출산예정일이 40주보다 뒤예요. 날짜를 확인해 주세요';
  }
}
