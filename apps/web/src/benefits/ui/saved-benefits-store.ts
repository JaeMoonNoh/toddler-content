'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SavedBenefits } from '../domain/saved-benefits';

// NOTE: 로그인 전까지 저장한 혜택은 이 기기(브라우저)에만 둔다. 서버로 보내지 않는다
const STORAGE_KEY = 'toddler.saved-benefits';

export interface SavedBenefitsValue {
  saved: SavedBenefits;
  update: (change: (saved: SavedBenefits) => SavedBenefits) => void;
}

export const SavedBenefitsContext = createContext<SavedBenefitsValue | null>(null);

export function useSavedBenefitsStore(): SavedBenefitsValue {
  const [saved, setSaved] = useState(SavedBenefits.empty);
  // 서버에서 그린 화면과 맞추려고 처음엔 빈 목록으로 그린 뒤 불러온다
  useEffect(() => setSaved(readSaved()), []);

  const update = (change: (saved: SavedBenefits) => SavedBenefits) =>
    setSaved((current) => {
      const next = change(current);
      writeSaved(next);
      return next;
    });

  return { saved, update };
}

// 카드에서 저장 버튼을 그릴 때 쓴다. 저장 기능이 없는 화면이면 null
export function useSavedBenefits(): SavedBenefitsValue | null {
  return useContext(SavedBenefitsContext);
}

// 사생활 보호 창이나 저장을 막아 둔 브라우저에서는 읽기·쓰기가 실패할 수 있다. 그때는 이번 화면에서만 기억한다
function readSaved(): SavedBenefits {
  try {
    const text = window.localStorage.getItem(STORAGE_KEY);
    return text ? SavedBenefits.fromJSON(JSON.parse(text)) : SavedBenefits.empty();
  } catch {
    return SavedBenefits.empty();
  }
}

function writeSaved(saved: SavedBenefits) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    // 위와 같은 이유로 무시한다
  }
}
