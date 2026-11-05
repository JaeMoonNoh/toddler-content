import type { SavedState } from '../../benefits/domain/saved-benefits';

export interface SavedItem {
  slug: string;
  state: SavedState;
}

const URL = '/api/me/saved-benefits';

// 로그인했으면 이 기기에 저장해 둔 혜택을 계정에 합치고 계정의 전체 목록을 받는다.
// 로그인하지 않았거나 실패하면 null (그때는 기기에 그대로 둔다)
export async function mergeIntoAccount(items: SavedItem[]): Promise<SavedItem[] | null> {
  try {
    const response = await fetch(`${URL}/merge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    if (!response.ok) return null;
    return ((await response.json()) as { items: SavedItem[] }).items;
  } catch {
    return null;
  }
}

// state가 null이면 뺀다
export async function saveToAccount(slug: string, state: SavedState | null): Promise<void> {
  const response =
    state === null
      ? await fetch(`${URL}/${slug}`, { method: 'DELETE' })
      : await fetch(`${URL}/${slug}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ state }) });
  if (!response.ok) throw new Error(`저장하지 못했어요 (${response.status})`);
}
