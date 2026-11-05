import type { SavedConditions } from '../domain/saved-conditions';

export type ConditionsResult = { loggedIn: false } | { loggedIn: true; conditions: SavedConditions | null; updatedAt: string | null };

const URL = '/api/me/conditions';

// 로그인하지 않았거나 서버가 꺼져 있으면 로그인 안 된 것으로 보고, 화면은 그대로 쓴다
export async function fetchSavedConditions(): Promise<ConditionsResult> {
  try {
    const response = await fetch(URL, { cache: 'no-store' });
    if (!response.ok) return { loggedIn: false };
    const body = (await response.json()) as { conditions: SavedConditions | null; updatedAt: string | null };
    return { loggedIn: true, conditions: body.conditions, updatedAt: body.updatedAt };
  } catch {
    return { loggedIn: false };
  }
}

export async function saveConditions(conditions: SavedConditions, consent: boolean): Promise<{ updatedAt: string }> {
  const response = await fetch(URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conditions, consent }),
  });
  if (!response.ok) throw new Error(`저장하지 못했어요 (${response.status})`);
  return (await response.json()) as { updatedAt: string };
}

export async function deleteConditions(): Promise<void> {
  const response = await fetch(URL, { method: 'DELETE' });
  if (!response.ok) throw new Error(`지우지 못했어요 (${response.status})`);
}
