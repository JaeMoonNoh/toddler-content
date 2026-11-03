import { describe, expect, it } from 'vitest';

import { type Page, PagedSourceFetcher, SourceFormatError } from '../sources/paged-source-fetcher';

import type { SourceRecord } from '../../domain/source-record';

type Item = { id: string; name: string };

class ScriptedFetcher extends PagedSourceFetcher<Item> {
  readonly source = 'GOV24' as const;
  readonly requestedPages: number[] = [];

  constructor(
    protected readonly pageSize: number,
    private readonly pages: Page<Item>[],
    protected readonly maxPages = 100,
  ) {
    super();
  }

  protected async fetchPage(page: number) {
    this.requestedPages.push(page);
    return this.pages[page - 1] ?? { items: [], totalCount: this.pages[0].totalCount };
  }

  protected toRecord(item: Item): SourceRecord {
    return { externalId: item.id, name: item.name, payload: item };
  }
}

const items = (from: number, count: number) =>
  Array.from({ length: count }, (_, i) => ({ id: String(from + i), name: `혜택 ${from + i}` }));

describe('PagedSourceFetcher', () => {
  it('한 페이지에 다 들어오면 한 번만 요청한다', async () => {
    const fetcher = new ScriptedFetcher(10, [{ items: items(1, 3), totalCount: 3 }]);

    expect(await fetcher.fetchAll()).toHaveLength(3);
    expect(fetcher.requestedPages).toEqual([1]);
  });

  it('전체 건수가 페이지 크기로 딱 나눠떨어지면 빈 페이지를 더 요청하지 않는다', async () => {
    const fetcher = new ScriptedFetcher(2, [
      { items: items(1, 2), totalCount: 4 },
      { items: items(3, 2), totalCount: 4 },
    ]);

    expect(await fetcher.fetchAll()).toHaveLength(4);
    expect(fetcher.requestedPages).toEqual([1, 2]);
  });

  it('마지막 페이지가 덜 차 있어도 전부 모은다', async () => {
    const fetcher = new ScriptedFetcher(2, [
      { items: items(1, 2), totalCount: 5 },
      { items: items(3, 2), totalCount: 5 },
      { items: items(5, 1), totalCount: 5 },
    ]);

    expect((await fetcher.fetchAll()).map((r) => r.externalId)).toEqual(['1', '2', '3', '4', '5']);
  });

  it('전체가 0건이면 빈 목록을 돌려준다 (막는 건 비즈니스 정책의 몫)', async () => {
    const fetcher = new ScriptedFetcher(10, [{ items: [], totalCount: 0 }]);
    expect(await fetcher.fetchAll()).toEqual([]);
  });

  it('중간 페이지가 비어 있으면 중단한다', async () => {
    const fetcher = new ScriptedFetcher(2, [
      { items: items(1, 2), totalCount: 6 },
      { items: [], totalCount: 6 },
    ]);
    await expect(fetcher.fetchAll()).rejects.toThrow('2페이지가 비어 있습니다');
  });

  it('받은 건수가 전체 건수보다 적으면 중단한다', async () => {
    const fetcher = new ScriptedFetcher(10, [{ items: items(1, 7), totalCount: 8 }]);
    await expect(fetcher.fetchAll()).rejects.toThrow('전체 8건 중 7건만');
  });

  it('수집 중에 항목이 늘어 전체 건수보다 많이 받아도 받아들인다', async () => {
    const fetcher = new ScriptedFetcher(10, [{ items: items(1, 4), totalCount: 3 }]);
    expect(await fetcher.fetchAll()).toHaveLength(4);
  });

  it('최대 페이지 수를 넘으면 요청하기 전에 중단한다', async () => {
    const fetcher = new ScriptedFetcher(10, [{ items: items(1, 10), totalCount: 1_000_000 }], 5);

    await expect(fetcher.fetchAll()).rejects.toThrow(SourceFormatError);
    expect(fetcher.requestedPages).toEqual([1]);
  });

  it('ID가 빈 항목이 있으면 중단한다', async () => {
    const fetcher = new ScriptedFetcher(10, [{ items: [{ id: '', name: '이상한 항목' }], totalCount: 1 }]);
    await expect(fetcher.fetchAll()).rejects.toThrow('ID가 없는 항목이 있습니다 (이상한 항목)');
  });

  it('페이지를 가져오다 실패하면 그 오류를 그대로 던진다', async () => {
    class Failing extends ScriptedFetcher {
      protected async fetchPage(page: number): Promise<Page<Item>> {
        if (page === 2) throw new Error('HTTP 500');
        return super.fetchPage(page);
      }
    }
    const fetcher = new Failing(2, [{ items: items(1, 2), totalCount: 4 }]);
    await expect(fetcher.fetchAll()).rejects.toThrow('HTTP 500');
  });
});
