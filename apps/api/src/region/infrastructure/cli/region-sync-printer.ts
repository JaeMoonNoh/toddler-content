import { hasRegionChanges, type Region } from '../../domain/region';

import type { RegionSyncResult } from '../../application/region.service';

// 지역 목록을 새로 받은 결과를 사람이 읽는 글로 바꾼다
export function printRegionSync({ count, changes }: RegionSyncResult): string {
  const head = `지역 목록 반영: ${count.toLocaleString()}곳`;
  if (!hasRegionChanges(changes)) return `${head}, 바뀐 곳 없음`;
  const name = (region: Region) => `${region.fullName} (${region.code})`;
  return [
    `${head}, 생김 ${changes.added.length} · 사라짐 ${changes.removed.length} · 바뀜 ${changes.renamed.length}`,
    ...changes.added.map((region) => `    생김    ${name(region)}`),
    ...changes.removed.map((region) => `    사라짐  ${name(region)}`),
    ...changes.renamed.map(({ before, after }) => `    바뀜    ${name(before)} → ${after.fullName}`),
    '행정구역이 바뀌었다면 그 지역 혜택의 지역 코드도 확인해 주세요.',
  ].join('\n');
}
