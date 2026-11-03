import { type SourceRecord } from '../../../domain/source-record';
import { VOLATILE_FIELDS } from '../../../../shared/domain/source-id';
import type { HttpClient } from '../../http/http-client';
import { PagedSourceFetcher, SourceFormatError, type Page } from '../paged-source-fetcher';
import { ServiceKey } from '../service-key';

type Gov24Item = Record<string, unknown> & { 서비스ID?: string; 서비스명?: string };

const LIST_URL = 'https://api.odcloud.kr/api/gov24/v3/serviceList';

// 보조금24 (행정안전부 공공서비스 정보)
export class Gov24Fetcher extends PagedSourceFetcher<Gov24Item> {
  readonly source = 'GOV24' as const;
  readonly ignoredFields = VOLATILE_FIELDS.GOV24;
  protected readonly pageSize = 1000;

  constructor(
    private readonly http: HttpClient,
    private readonly key: ServiceKey | null,
  ) {
    super();
  }

  protected async fetchPage(page: number): Promise<Page<Gov24Item>> {
    const url = new URL(LIST_URL);
    url.searchParams.set('page', String(page));
    url.searchParams.set('perPage', String(this.pageSize));

    const body = parseJson(await this.http.getText(ServiceKey.required(this.key).signed(url)));
    if (!Array.isArray(body.data) || typeof body.totalCount !== 'number') {
      throw new SourceFormatError(`GOV24: 예상과 다른 응답입니다 (${JSON.stringify(body).slice(0, 200)})`);
    }
    return { items: body.data as Gov24Item[], totalCount: body.totalCount };
  }

  protected toRecord(item: Gov24Item): SourceRecord {
    return { externalId: String(item.서비스ID ?? ''), name: String(item.서비스명 ?? ''), payload: item };
  }
}

function parseJson(text: string): Record<string, unknown> {
  try {
    return JSON.parse(text);
  } catch {
    throw new SourceFormatError(`GOV24: JSON이 아닌 응답입니다 (${text.slice(0, 200)})`);
  }
}
