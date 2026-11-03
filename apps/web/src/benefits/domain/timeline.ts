import type { BenefitSchedule, PublishedBenefit } from './benefit';
import type { CalendarDate } from './calendar-date';
import type { RegionChoice } from './region';
import { ScheduleWindow, type WindowStatus } from './schedule-window';

export interface TimelineItem {
  benefit: PublishedBenefit;
  schedule: BenefitSchedule;
  window: ScheduleWindow;
  status: WindowStatus;
}

export interface TimelinePhase {
  label: string;
  items: TimelineItem[];
}

export interface Timeline {
  phases: TimelinePhase[]; // 시작일 순서
  unscheduled: PublishedBenefit[]; // 신청 기간 규칙을 아직 정리하지 않은 혜택
}

// 시작일이 출산예정일 기준 어디쯤인지로 묶는다
const PHASES: { label: string; startsBefore: number }[] = [
  { label: '임신 중', startsBefore: -45 },
  { label: '출산 준비 (출산 45일 전부터)', startsBefore: 0 },
  { label: '출산 직후 (60일 안)', startsBefore: 61 },
  { label: '그 이후', startsBefore: Infinity },
];

export function buildTimeline(region: RegionChoice, benefits: PublishedBenefit[], due: CalendarDate, today: CalendarDate): Timeline {
  const available = benefits.filter((b) => region.covers(b));
  const items = available
    .flatMap((benefit) => {
      if (!benefit.schedule) return [];
      const window = ScheduleWindow.of(benefit.schedule, due);
      return { benefit, schedule: benefit.schedule, window, status: window.statusOn(today) };
    })
    .sort((a, b) => a.window.start.daysSince(b.window.start) || a.window.end.daysSince(b.window.end) || a.benefit.name.localeCompare(b.benefit.name, 'ko'));

  const phases = PHASES.map(({ label }, index) => ({
    label,
    items: items.filter((item) => phaseIndexOf(item.window.start.daysSince(due)) === index),
  })).filter((phase) => phase.items.length > 0);

  return { phases, unscheduled: available.filter((b) => !b.schedule) };
}

function phaseIndexOf(daysFromDue: number) {
  return PHASES.findIndex((phase) => daysFromDue < phase.startsBefore);
}
