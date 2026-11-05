import type { CalendarDate } from '../domain/calendar-date';

export interface ChildDatesInput {
  dueText: string;
  born: boolean;
  birthText: string;
}

// 태어나기 전에는 출산예정일만, 태어나면 실제 출생일로 일정을 다시 계산한다
export function ChildDatesField({ input, today, stageText, onChange }: { input: ChildDatesInput; today: CalendarDate; stageText: string; onChange: (next: ChildDatesInput) => void }) {
  return (
    <div className="field">
      <label htmlFor="due">출산예정일</label>
      <input id="due" type="date" value={input.dueText} onChange={(e) => onChange({ ...input, dueText: e.target.value })} />
      <label className="check">
        <input type="checkbox" checked={input.born} onChange={(e) => onChange({ ...input, born: e.target.checked })} />
        아이가 태어났어요
      </label>
      {input.born && (
        <>
          <label htmlFor="birth">출생일</label>
          <input id="birth" type="date" max={today.toIso()} value={input.birthText} onChange={(e) => onChange({ ...input, birthText: e.target.value })} />
        </>
      )}
      <p className="stage" aria-live="polite">
        {stageText}
      </p>
    </div>
  );
}
