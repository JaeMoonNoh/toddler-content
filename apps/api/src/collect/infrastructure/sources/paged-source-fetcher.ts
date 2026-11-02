import { SourceFetcher } from '../../application/ports/source-fetcher';
import type { SourceRecord } from '../../domain/source-record';

export interface Page<Item> {
  items: Item[];
  totalCount: number;
}

export class SourceFormatError extends Error {}

// 페이지를 넘기며 전체 목록을 모으는 공통 흐름. 출처마다 한 페이지를 가져오는 법과 항목을 원본으로 바꾸는 법만 정한다.
export abstract class PagedSourceFetcher<Item> extends SourceFetcher {
  protected abstract readonly pageSize: number;
  protected readonly maxPages: number = 100;

  protected abstract fetchPage(page: number): Promise<Page<Item>>;
  protected abstract toRecord(item: Item): SourceRecord;

  async fetchAll(): Promise<SourceRecord[]> {
    const items = await this.fetchAllItems();
    return items.map((item) => this.validated(this.toRecord(item)));
  }

  private async fetchAllItems(): Promise<Item[]> {
    const first = await this.fetchPage(1);
    const lastPage = Math.ceil(first.totalCount / this.pageSize);
    if (lastPage > this.maxPages) {
      throw new SourceFormatError(`${this.source}: 전체 ${first.totalCount}건은 최대 ${this.maxPages}페이지를 넘습니다.`);
    }

    const items = [...first.items];
    for (let page = 2; page <= lastPage; page++) {
      const { items: pageItems } = await this.fetchPage(page);
      if (pageItems.length === 0) throw new SourceFormatError(`${this.source}: ${page}페이지가 비어 있습니다.`);
      items.push(...pageItems);
    }

    if (items.length < first.totalCount) {
      throw new SourceFormatError(`${this.source}: 전체 ${first.totalCount}건 중 ${items.length}건만 받았습니다.`);
    }
    return items;
  }

  private validated(record: SourceRecord): SourceRecord {
    if (!record.externalId) {
      throw new SourceFormatError(`${this.source}: ID가 없는 항목이 있습니다 (${record.name || '이름 없음'}).`);
    }
    return record;
  }
}
