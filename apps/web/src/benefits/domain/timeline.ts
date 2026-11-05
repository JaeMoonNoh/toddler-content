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
  tab: string; // 탭에 쓰는 짧은 이름
  items: TimelineItem[];
}

export interface Timeline {
  phases: TimelinePhase[]; // 시작일 순서
  unscheduled: PublishedBenefit[]; // 신청 기간 규칙을 아직 정리하지 않은 혜택
}

// 시작일이 출산예정일 기준 어디쯤인지로 묶는다
const PHASES: { label: string; tab: string; startsBefore: number }[] = [
  { label: '임신 중', tab: '임신 중', startsBefore: -45 },
  { label: '출산 준비 (출산 45일 전부터)', tab: '출산 준비', startsBefore: 0 },
  { label: '출산 직후 (60일 안)', tab: '출산 직후', startsBefore: 61 },
  { label: '그 이후', tab: '그 이후', startsBefore: Infinity },
];

export const SAVED_TAB = '저장한 혜택';
export const ALL_TAB = '전체';
export const OTHER_TAB = '그 밖의 혜택';

export interface TimelineTab {
  label: string;
  count: number;
}

// 시기 탭: 저장한 혜택, 전체, 혜택이 있는 시기들, 일정이 없는 그 밖의 혜택. 비어 있는 탭은 만들지 않는다
// 출산예정일이 없으면 시기를 나눌 수 없어서, 저장한 혜택이 있을 때만 저장한 혜택과 전체로 나눈다
export function tabsOf(timeline: Timeline | null, otherCount: number, savedCount: number): TimelineTab[] {
  if (!timeline && savedCount === 0) return [];
  const phases = timeline?.phases.map((phase) => ({ label: phase.tab, count: phase.items.length })) ?? [];
  const all = phases.reduce((sum, tab) => sum + tab.count, otherCount);
  return [
    ...(savedCount > 0 ? [{ label: SAVED_TAB, count: savedCount }] : []),
    { label: ALL_TAB, count: all },
    ...phases,
    ...(timeline && otherCount > 0 ? [{ label: OTHER_TAB, count: otherCount }] : []),
  ];
}

// 저장한 혜택처럼 따로 보여주는 것을 시기 묶음에서 뺀다
export function withoutBenefits(timeline: Timeline, isOmitted: (benefit: PublishedBenefit) => boolean): Timeline {
  const phases = timeline.phases
    .map((phase) => ({ ...phase, items: phase.items.filter((item) => !isOmitted(item.benefit)) }))
    .filter((phase) => phase.items.length > 0);
  return { phases, unscheduled: timeline.unscheduled.filter((benefit) => !isOmitted(benefit)) };
}

export function buildTimeline(region: RegionChoice, benefits: PublishedBenefit[], due: CalendarDate, today: CalendarDate): Timeline {
  const available = benefits.filter((b) => region.covers(b));
  const items = available
    .flatMap((benefit) => {
      if (!benefit.schedule) return [];
      const window = ScheduleWindow.of(benefit.schedule, due);
      return { benefit, schedule: benefit.schedule, window, status: window.statusOn(today) };
    })
    .sort((a, b) => a.window.start.daysSince(b.window.start) || a.window.end.daysSince(b.window.end) || a.benefit.name.localeCompare(b.benefit.name, 'ko'));

  const phases = PHASES.map(({ label, tab }, index) => ({
    label,
    tab,
    items: items.filter((item) => phaseIndexOf(item.window.start.daysSince(due)) === index),
  })).filter((phase) => phase.items.length > 0);

  return { phases, unscheduled: available.filter((b) => !b.schedule) };
}

function phaseIndexOf(daysFromDue: number) {
  return PHASES.findIndex((phase) => daysFromDue < phase.startsBefore);
}
