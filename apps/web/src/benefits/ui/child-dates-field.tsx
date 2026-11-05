import { babySizeOf } from '../domain/baby-size';
import type { CalendarDate } from '../domain/calendar-date';
import { callNameOf, NAME_MAX_LENGTH } from '../domain/child-name';
import { type ChildStage, describeStage } from '../domain/pregnancy';
import { BabySizeCard } from './baby-size-card';

export interface ChildDatesInput {
  dueText: string;
  nickname: string;
  born: boolean;
  birthText: string;
  name: string;
}

// 태어나기 전에는 출산예정일만, 태어나면 실제 출생일로 일정을 다시 계산한다. 태명과 이름은 부를 때만 쓴다
export function ChildDatesField({ input, today, stage, onChange }: { input: ChildDatesInput; today: CalendarDate; stage: ChildStage | null; onChange: (next: ChildDatesInput) => void }) {
  const size = stage && babySizeOf(stage);
  return (
    <div className="field">
      <label htmlFor="due">출산예정일</label>
      <input id="due" type="date" value={input.dueText} onChange={(e) => onChange({ ...input, dueText: e.target.value })} />
      <label htmlFor="nickname">태명 (선택)</label>
      <input id="nickname" type="text" maxLength={NAME_MAX_LENGTH} placeholder="예: 콩이" value={input.nickname} onChange={(e) => onChange({ ...input, nickname: e.target.value })} />
      <label className="check">
        <input type="checkbox" checked={input.born} onChange={(e) => onChange({ ...input, born: e.target.checked })} />
        아이가 태어났어요
      </label>
      {input.born && (
        <>
          <label htmlFor="birth">출생일</label>
          <input id="birth" type="date" max={today.toIso()} value={input.birthText} onChange={(e) => onChange({ ...input, birthText: e.target.value })} />
          <label htmlFor="child-name">아이 이름 (선택)</label>
          <input id="child-name" type="text" maxLength={NAME_MAX_LENGTH} value={input.name} onChange={(e) => onChange({ ...input, name: e.target.value })} />
        </>
      )}
      <p className="stage" aria-live="polite">
        {stage ? describeStage(stage) : '출산예정일을 넣으면 신청 일정을 날짜로 계산해 드려요'}
      </p>
      {size && <BabySizeCard size={size} callName={callNameOf(input)} weeks={stage.kind === 'pregnant' ? stage.weeks : null} />}
    </div>
  );
}
