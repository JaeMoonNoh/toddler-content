import { readFile, writeFile } from 'node:fs/promises';

import { RegionCatalog } from '../../application/ports/region-catalog';

import type { Region, RegionDirectory } from '../../domain/region';

// apps/api/data/regions.json. 지역 한 곳을 한 줄로 써서 개편이 생기면 바뀐 줄만 diff에 보이게 한다
export class JsonRegionCatalog extends RegionCatalog {
  constructor(private readonly path: string) {
    super();
  }

  async load(): Promise<RegionDirectory | null> {
    try {
      return JSON.parse(await readFile(this.path, 'utf8')) as RegionDirectory;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw error;
    }
  }

  async save(directory: RegionDirectory): Promise<void> {
    await writeFile(this.path, toFileText(directory));
  }
}

export function toFileText({ source, fetchedOn, regions }: RegionDirectory): string {
  const line = (region: Region) =>
    `    ${JSON.stringify({ code: region.code, name: region.name, fullName: region.fullName, parentCode: region.parentCode })}`;
  return `{\n  "source": ${JSON.stringify(source)},\n  "fetchedOn": ${JSON.stringify(fetchedOn)},\n  "regions": [\n${regions.map(line).join(',\n')}\n  ]\n}\n`;
}
