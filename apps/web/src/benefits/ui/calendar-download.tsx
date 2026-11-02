'use client';

import { deadlineEventsOf } from '../domain/deadline-event';
import { IcsCalendar } from '../domain/ics-calendar';
import type { Timeline } from '../domain/timeline';

// 파일은 브라우저 안에서 만들어 바로 내려받는다 (서버를 거치지 않는다)
export function CalendarDownload({ timeline }: { timeline: Timeline }) {
  const events = deadlineEventsOf(timeline);
  if (events.length === 0) return null;

  const download = () => {
    const file = new Blob([new IcsCalendar(events, new Date()).toString()], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = '출산-혜택-마감일.ics';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="ics">
      <button type="button" className="btn" onClick={download}>
        마감일 {events.length}건을 내 캘린더에 추가 (.ics)
      </button>
      <small>아이폰·갤럭시·구글 캘린더에서 열 수 있어요. 마감 3일 전에 알려드려요.</small>
    </div>
  );
}
