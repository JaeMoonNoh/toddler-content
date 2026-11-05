'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { mergeIntoAccount, saveToAccount } from '../../account/api/saved-benefits-client';
import { SavedBenefits, type SavedState } from '../domain/saved-benefits';

// 로그인하지 않으면 이 기기(브라우저)에만 둔다. 로그인하면 계정에 두고 기기에 있던 것은 계정으로 옮긴다
const STORAGE_KEY = 'toddler.saved-benefits';

export type SavedPlace = 'device' | 'account';

export interface SavedBenefitsValue {
  saved: SavedBenefits;
  place: SavedPlace;
  change: (slug: string, state: SavedState | null) => void; // null이면 뺀다
}

export const SavedBenefitsContext = createContext<SavedBenefitsValue | null>(null);

export function useSavedBenefitsStore(): SavedBenefitsValue {
  const [saved, setSaved] = useState(SavedBenefits.empty);
  const [place, setPlace] = useState<SavedPlace>('device');

  // 서버에서 그린 화면과 맞추려고 처음엔 빈 목록으로 그린 뒤 불러온다
  useEffect(() => {
    void loadSaved().then((loaded) => {
      setSaved(loaded.saved);
      setPlace(loaded.place);
    });
  }, []);

  const change = (slug: string, state: SavedState | null) => {
    const before = saved;
    const next = saved.withState(slug, state);
    setSaved(next);
    if (place === 'device') return writeDevice(next);
    // 계정에 저장하지 못하면 화면도 되돌린다
    saveToAccount(slug, state).catch(() => setSaved(before));
  };

  return { saved, place, change };
}

// 카드에서 저장 버튼을 그릴 때 쓴다. 저장 기능이 없는 화면이면 null
export function useSavedBenefits(): SavedBenefitsValue | null {
  return useContext(SavedBenefitsContext);
}

async function loadSaved(): Promise<{ saved: SavedBenefits; place: SavedPlace }> {
  const device = readDevice();
  const account = await mergeIntoAccount(device.items);
  if (!account) return { saved: device, place: 'device' };
  // 계정으로 옮겼으니 기기에서는 지운다. 로그아웃하면 이 기기에는 남지 않는다
  writeDevice(SavedBenefits.empty());
  return { saved: SavedBenefits.fromItems(account), place: 'account' };
}

// 사생활 보호 창이나 저장을 막아 둔 브라우저에서는 읽기·쓰기가 실패할 수 있다. 그때는 이번 화면에서만 기억한다
function readDevice(): SavedBenefits {
  try {
    const text = window.localStorage.getItem(STORAGE_KEY);
    return text ? SavedBenefits.fromJSON(JSON.parse(text)) : SavedBenefits.empty();
  } catch {
    return SavedBenefits.empty();
  }
}

function writeDevice(saved: SavedBenefits) {
  try {
    if (saved.items.length === 0) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch {
    // 위와 같은 이유로 무시한다
  }
}
