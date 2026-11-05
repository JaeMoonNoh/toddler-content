'use client';

import { useEffect, useState } from 'react';
import type { RegionTree } from '../../benefits/domain/region';
import { deleteConditions, fetchSavedConditions, saveConditions } from '../api/conditions-client';
import { type FinderInput, type SavedConditions, toFinderInput } from '../domain/saved-conditions';

export type AccountConditions =
  | { status: 'loading' | 'logged-out' }
  | { status: 'ready'; saved: SavedConditions | null; updatedAt: string | null };

// 로그인했으면 저장한 조건을 불러와 화면에 한 번 채운다
export function useAccountConditions(tree: RegionTree, fill: (input: FinderInput) => void) {
  const [state, setState] = useState<AccountConditions>({ status: 'loading' });

  useEffect(() => {
    void fetchSavedConditions().then((result) => {
      if (!result.loggedIn) return setState({ status: 'logged-out' });
      setState({ status: 'ready', saved: result.conditions, updatedAt: result.updatedAt });
      if (result.conditions) fill(toFinderInput(result.conditions, tree));
    });
    // NOTE: 처음 열 때 한 번만 채운다. 그 뒤 입력을 바꿔도 다시 덮어쓰지 않는다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (conditions: SavedConditions, consent: boolean) => {
    const { updatedAt } = await saveConditions(conditions, consent);
    setState({ status: 'ready', saved: conditions, updatedAt });
  };

  const remove = async () => {
    await deleteConditions();
    setState({ status: 'ready', saved: null, updatedAt: null });
  };

  return { state, save, remove };
}
