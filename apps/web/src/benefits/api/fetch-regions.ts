import type { RegionDirectory } from '../domain/region';

export type RegionsResult = { ok: true; directory: RegionDirectory } | { ok: false };

// 행정구역은 거의 바뀌지 않아서 하루 동안 재사용한다
export async function fetchRegionDirectory(): Promise<RegionsResult> {
  const base = process.env.API_INTERNAL_URL ?? 'http://localhost:4000';
  try {
    const res = await fetch(`${base}/regions`, { next: { revalidate: 86_400 } });
    if (!res.ok) return { ok: false };
    return { ok: true, directory: (await res.json()) as RegionDirectory };
  } catch {
    return { ok: false };
  }
}
