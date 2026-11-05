export interface AccountInfo {
  providers: string[];
  joinedAt: string;
}

// 로그인하지 않았으면 null
export async function fetchAccount(): Promise<AccountInfo | null> {
  try {
    const response = await fetch('/api/me/account', { cache: 'no-store' });
    return response.ok ? ((await response.json()) as AccountInfo) : null;
  } catch {
    return null;
  }
}

export async function withdraw(): Promise<void> {
  const response = await fetch('/api/me/account', { method: 'DELETE' });
  if (!response.ok) throw new Error(`탈퇴하지 못했어요 (${response.status})`);
}

export async function fetchSavedBenefitCount(): Promise<number> {
  const response = await fetch('/api/me/saved-benefits', { cache: 'no-store' });
  return response.ok ? ((await response.json()) as { items: unknown[] }).items.length : 0;
}
