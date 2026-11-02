// 혜택의 신청 기간 규칙. 날짜 계산은 사용자의 출산예정일로 브라우저에서 하고, 여기서는 규칙만 다룬다

// pregnancy: 임신 시작(출산예정일 280일 전), birth: 출생일 (태어나기 전에는 출산예정일로 계산)
export type ScheduleAnchor = 'pregnancy' | 'birth';

export interface ScheduleOffset {
  anchor: ScheduleAnchor;
  months: number;
  days: number;
}

export interface BenefitSchedule {
  from: ScheduleOffset;
  until: ScheduleOffset;
  untilLabel: string; // 끝나는 날의 뜻. 예: "소급 신청 마감", "사용 기한"
  summary: string; // 사용자에게 보여줄 한 줄 설명
  basis: { text: string; url: string }; // 이 규칙의 근거가 된 원문 문장과 링크
}

const ANCHOR_DAYS: Record<ScheduleAnchor, number> = { pregnancy: -280, birth: 0 };
const DAYS_PER_MONTH = 30.44;

export function scheduleProblems(schedule: BenefitSchedule): string[] {
  return [
    !schedule.untilLabel.trim() && '일정의 마감 설명이 비어 있습니다',
    !schedule.summary.trim() && '일정 설명이 비어 있습니다',
    !schedule.basis.text.trim() && '일정의 근거 문장이 비어 있습니다',
    !schedule.basis.url.startsWith('https://') && `일정 근거 링크는 https 주소여야 합니다: "${schedule.basis.url}"`,
    approximateDays(schedule.from) > approximateDays(schedule.until) && '일정이 끝나는 날이 시작하는 날보다 앞입니다',
  ].filter((problem): problem is string => Boolean(problem));
}

// 출생일 기준 대략의 날수. 시작과 끝의 순서를 검사할 때만 쓴다
function approximateDays({ anchor, months, days }: ScheduleOffset) {
  return ANCHOR_DAYS[anchor] + months * DAYS_PER_MONTH + days;
}

export function sameSchedule(a: BenefitSchedule | null, b: BenefitSchedule | null) {
  return canonical(a) === canonical(b);
}

function canonical(schedule: BenefitSchedule | null) {
  if (!schedule) return 'null';
  const offset = (o: ScheduleOffset) => [o.anchor, o.months, o.days];
  const { from, until, untilLabel, summary, basis } = schedule;
  return JSON.stringify([offset(from), offset(until), untilLabel, summary, basis.text, basis.url]);
}
