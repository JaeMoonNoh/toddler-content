// 해마다 공고하는 사업의 올해 신청 기간 (실제 날짜). 출생일 기준 일정(BenefitSchedule)과 따로 둔다.
// 기간이 지나도 혜택은 지우지 않는다. 다음 해에 다시 열리는 경우가 많아서 화면에서 "마감됨"으로만 표시한다

export interface ApplicationPeriod {
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
  basis: { text: string; url: string };
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isRealDate(text: string) {
  return ISO_DATE.test(text) && new Date(`${text}T00:00:00Z`).toISOString().slice(0, 10) === text;
}

export function periodProblems(period: ApplicationPeriod): string[] {
  const datesValid = isRealDate(period.start) && isRealDate(period.end);
  return [
    !isRealDate(period.start) && `신청 시작일이 올바른 날짜(YYYY-MM-DD)가 아닙니다: "${period.start}"`,
    !isRealDate(period.end) && `신청 마감일이 올바른 날짜(YYYY-MM-DD)가 아닙니다: "${period.end}"`,
    datesValid && period.start > period.end && '신청 마감일이 시작일보다 앞입니다',
    !period.basis.text.trim() && '신청 기간의 근거 문장이 비어 있습니다',
    !period.basis.url.startsWith('https://') && `신청 기간 근거 링크는 https 주소여야 합니다: "${period.basis.url}"`,
  ].filter((problem): problem is string => Boolean(problem));
}

export function samePeriod(a: ApplicationPeriod | null, b: ApplicationPeriod | null) {
  const key = (p: ApplicationPeriod | null) => (p ? JSON.stringify([p.start, p.end, p.basis.text, p.basis.url]) : 'null');
  return key(a) === key(b);
}
