'use client';

import { useSavedBenefits } from './saved-benefits-store';

// 저장 전: 저장. 저장 후: 신청했는지 표시하거나 목록에서 빼기
export function SaveControls({ slug }: { slug: string }) {
  const context = useSavedBenefits();
  if (!context) return null;
  const { saved, update } = context;
  const state = saved.stateOf(slug);

  if (!state) {
    return (
      <button type="button" className="linkbtn" onClick={() => update((s) => s.save(slug))}>
        저장
      </button>
    );
  }
  return (
    <>
      {state === 'todo' ? (
        <button type="button" className="linkbtn" onClick={() => update((s) => s.markApplied(slug))}>
          신청했어요
        </button>
      ) : (
        <button type="button" className="linkbtn" onClick={() => update((s) => s.save(slug))}>
          신청 전으로
        </button>
      )}
      <button type="button" className="linkbtn" onClick={() => update((s) => s.remove(slug))}>
        빼기
      </button>
    </>
  );
}

export function useIsApplied(slug: string): boolean {
  return useSavedBenefits()?.saved.stateOf(slug) === 'applied';
}
