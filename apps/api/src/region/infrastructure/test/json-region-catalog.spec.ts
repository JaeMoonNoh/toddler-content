import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { SAMPLE_REGIONS } from '../../application/test/fakes/regions';
import { JsonRegionCatalog } from '../catalog/json-region-catalog';

const directory = { source: '행정안전부 행정표준코드(법정동코드)', fetchedOn: '2026-11-03', regions: SAMPLE_REGIONS };

describe('JsonRegionCatalog', () => {
  it('저장한 목록을 그대로 다시 읽는다', async () => {
    const catalog = new JsonRegionCatalog(join(await mkdtemp(join(tmpdir(), 'regions-')), 'regions.json'));
    await catalog.save(directory);
    expect(await catalog.load()).toEqual(directory);
  });

  it('지역 한 곳을 한 줄로 쓴다', async () => {
    const path = join(await mkdtemp(join(tmpdir(), 'regions-')), 'regions.json');
    await new JsonRegionCatalog(path).save(directory);
    const lines = (await readFile(path, 'utf8')).split('\n');
    expect(lines.filter((line) => line.includes('"code"'))).toHaveLength(SAMPLE_REGIONS.length);
  });

  it('파일이 없으면 null', async () => {
    const catalog = new JsonRegionCatalog(join(await mkdtemp(join(tmpdir(), 'regions-')), 'none.json'));
    expect(await catalog.load()).toBeNull();
  });
});
