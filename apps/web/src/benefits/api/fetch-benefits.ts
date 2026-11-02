import type { PublishedBenefit } from '../domain/benefit';

export type BenefitsResult = { ok: true; benefits: PublishedBenefit[] } | { ok: false };

// 서버에서만 부른다. 컨테이너 안에서는 서비스 이름(api)으로, 로컬 개발에서는 localhost로 접속
export async function fetchPublishedBenefits(): Promise<BenefitsResult> {
  const base = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';
  try {
    const res = await fetch(`${base}/benefits`, { next: { revalidate: 300 } });
    if (!res.ok) return { ok: false };
    return { ok: true, benefits: (await res.json()) as PublishedBenefit[] };
  } catch {
    return { ok: false };
  }
}
