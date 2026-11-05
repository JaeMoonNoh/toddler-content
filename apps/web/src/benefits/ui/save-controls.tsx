'use client';

import { useSavedBenefits } from './saved-benefits-store';

// 저장 전: 저장. 저장 후: 신청했는지 표시하거나 목록에서 빼기
export function SaveControls({ slug }: { slug: string }) {
  const context = useSavedBenefits();
  if (!context) return null;
  const { saved, change } = context;
  const state = saved.stateOf(slug);

  if (!state) {
    return (
      <button type="button" className="linkbtn" onClick={() => change(slug, 'todo')}>
        저장
      </button>
    );
  }
  return (
    <>
      {state === 'todo' ? (
        <button type="button" className="linkbtn" onClick={() => change(slug, 'applied')}>
          신청했어요
        </button>
      ) : (
        <button type="button" className="linkbtn" onClick={() => change(slug, 'todo')}>
          신청 전으로
        </button>
      )}
      <button type="button" className="linkbtn" onClick={() => change(slug, null)}>
        빼기
      </button>
    </>
  );
}

export function useIsApplied(slug: string): boolean {
  return useSavedBenefits()?.saved.stateOf(slug) === 'applied';
}
