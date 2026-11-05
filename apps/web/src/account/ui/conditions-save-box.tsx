'use client';

import { useState } from 'react';
import { isSameConditions, type SavedConditions } from '../domain/saved-conditions';
import type { AccountConditions } from './use-account-conditions';

// 로그인한 사람만 보인다. 처음 저장할 때 한 번 동의를 받는다
export function ConditionsSaveBox({ state, current, onSave, onRemove }: {
  state: AccountConditions;
  current: SavedConditions;
  onSave: (conditions: SavedConditions, consent: boolean) => Promise<void>;
  onRemove: () => Promise<void>;
}) {
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (state.status !== 'ready') return null;

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : '잠시 뒤 다시 시도해 주세요');
    } finally {
      setBusy(false);
    }
  };
  const remove = () => {
    if (window.confirm('저장한 조건을 지울까요? 다시 저장하려면 동의를 다시 받아요.')) void run(onRemove);
  };

  if (!state.saved) {
    return (
      <div className="keep">
        <b>내 조건 저장</b>
        <label className="check">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <span>사는 곳, 출산예정일·출생일, 태명·이름, 몇째, 고용보험, 어린이집 답을 저장하는 데 동의해요</span>
        </label>
        <small>다음에 로그인하면 바로 채워져요. 언제든 지울 수 있어요.</small>
        <button type="button" className="btn" disabled={!agreed || busy} onClick={() => void run(() => onSave(current, true))}>
          저장
        </button>
        {error && <small className="keep-error">{error}</small>}
      </div>
    );
  }

  const changed = !isSameConditions(state.saved, current);
  return (
    <div className="keep">
      <p>
        {changed ? '저장한 조건에서 바뀐 게 있어요' : '저장한 조건으로 보고 있어요'}
        {state.updatedAt && <small>{koreanDate(state.updatedAt)} 저장</small>}
      </p>
      <div className="keep-actions">
        {changed && (
          <button type="button" className="btn" disabled={busy} onClick={() => void run(() => onSave(current, false))}>
            바뀐 조건 저장
          </button>
        )}
        <button type="button" className="linkbtn" disabled={busy} onClick={remove}>
          저장한 조건 지우기
        </button>
      </div>
      {error && <small className="keep-error">{error}</small>}
    </div>
  );
}

function koreanDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul', month: 'long', day: 'numeric' });
}
