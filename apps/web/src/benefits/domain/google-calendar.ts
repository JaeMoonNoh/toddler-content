import type { DeadlineEvent } from './deadline-event';

// 구글 캘린더 "일정 추가" 화면을 여는 주소. 사용자가 누를 때만 구글로 넘어간다
export function googleCalendarUrl(event: DeadlineEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${event.date.toCompact()}/${event.date.addDays(1).toCompact()}`,
    details: event.description,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
