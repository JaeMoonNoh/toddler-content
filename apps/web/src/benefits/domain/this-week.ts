import type { CalendarDate } from './calendar-date';
import type { ChildDates } from './child-dates';
import type { ChildStage } from './pregnancy';
import type { Timeline, TimelineItem } from './timeline';

const WEEK_DAYS = 7;
// NOTE: API가 원문 신청방법 "신청불필요"를 보고 이 문구로 시작하게 만든다 (apps/api/src/benefit/domain/how-to-apply-draft.ts)
const NO_APPLICATION_NEEDED = '따로 신청하지 않아도';

export interface ThisWeek {
  toDo: TimelineItem[]; // 이번 주에 열리거나, 막 열렸거나, 이번 주 안에 끝나는 것. 마감이 빠른 순서
  nextDeadline: TimelineItem | null; // 이번 주 것 말고 지금 신청할 수 있는 것 중 가장 먼저 끝나는 것
  nextOpening: TimelineItem | null; // 이번 주 것 말고 아직 열리지 않은 것 중 가장 먼저 열리는 것
}

// 처음 화면에서 "지금 무엇을 하면 되는지"만 골라 준다. 신청을 마쳤거나 신청할 필요가 없는 혜택은 뺀다
export function thisWeekOf(timeline: Timeline, today: CalendarDate, isDone: (slug: string) => boolean): ThisWeek {
  const items = timeline.phases
    .flatMap((phase) => phase.items)
    .filter((item) => !isDone(item.benefit.slug) && needsApplication(item));
  const toDo = items.filter((item) => isThisWeek(item, today)).sort(byDeadline);
  const later = items.filter((item) => !toDo.includes(item));
  return {
    toDo,
    nextDeadline: later.filter((item) => item.status.kind === 'open').sort(byDeadline)[0] ?? null,
    nextOpening: later.filter((item) => item.status.kind === 'upcoming').sort(byStart)[0] ?? null,
  };
}

function needsApplication({ benefit }: TimelineItem): boolean {
  return !benefit.howToApply?.summary.startsWith(NO_APPLICATION_NEEDED);
}

function isThisWeek({ status, window }: TimelineItem, today: CalendarDate): boolean {
  switch (status.kind) {
    case 'upcoming':
      return status.daysUntilStart <= WEEK_DAYS;
    case 'open':
      return status.daysLeft <= WEEK_DAYS || today.daysSince(window.start) < WEEK_DAYS;
    case 'closed':
      return false;
  }
}

function byDeadline(a: TimelineItem, b: TimelineItem) {
  return a.window.end.daysSince(b.window.end) || a.benefit.name.localeCompare(b.benefit.name, 'ko');
}

function byStart(a: TimelineItem, b: TimelineItem) {
  return a.window.start.daysSince(b.window.start) || byDeadline(a, b);
}

export interface Countdown {
  headline: string;
  detail: string;
}

// 맨 위 큰 글씨. 태어나기 전에는 만나는 날까지, 태어난 뒤에는 함께한 날을 센다
export function countdownOf(stage: ChildStage, dates: ChildDates, callName: string): Countdown | null {
  switch (stage.kind) {
    case 'pregnant':
      return {
        headline: stage.daysUntilDue === 0 ? `오늘 ${callName} 만나는 날` : `${callName} 만나기 ${stage.daysUntilDue}일 전`,
        detail: `임신 ${stage.weeks}주 ${stage.days}일 · 출산예정일 ${dates.due.format()}`,
      };
    case 'after-due':
      return { headline: `${callName}, 곧 만나요`, detail: `출산예정일 ${dates.due.format()} · 태어났다면 출생일을 넣어 주세요` };
    case 'born':
      return {
        headline: `${callName} 태어난 지 ${stage.daysSinceBirth}일`,
        detail: stage.months === 0 ? `출생일 ${dates.birthOrDue.format()}` : `${stage.months}개월 · 출생일 ${dates.birthOrDue.format()}`,
      };
    case 'too-far':
    case 'birth-in-future':
      return null;
  }
}
