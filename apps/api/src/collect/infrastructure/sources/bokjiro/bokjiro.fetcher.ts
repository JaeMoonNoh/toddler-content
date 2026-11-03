import { type SourceId, VOLATILE_FIELDS } from '../../../../shared/domain/source-id';
import { type SourceRecord } from '../../../domain/source-record';
import { type Page, PagedSourceFetcher } from '../paged-source-fetcher';

import { type BokjiroItem, parseBokjiroPage } from './bokjiro-response';

import type { HttpClient } from '../../../../shared/infrastructure/http-client';
import type { ServiceKey } from '../../../../shared/infrastructure/service-key';

// 복지로 목록 API 공통. 중앙부처와 지자체는 주소와 고정 파라미터만 다르다.
abstract class BokjiroFetcher extends PagedSourceFetcher<BokjiroItem> {
  abstract readonly source: SourceId;
  protected readonly pageSize = 500;
  protected abstract readonly listUrl: string;
  protected readonly fixedParams: Record<string, string> = {};

  get ignoredFields() {
    return VOLATILE_FIELDS[this.source];
  }

  constructor(
    private readonly http: HttpClient,
    private readonly key: ServiceKey,
  ) {
    super();
  }

  protected async fetchPage(page: number): Promise<Page<BokjiroItem>> {
    const url = new URL(this.listUrl);
    for (const [name, value] of Object.entries(this.fixedParams)) url.searchParams.set(name, value);
    url.searchParams.set('pageNo', String(page));
    url.searchParams.set('numOfRows', String(this.pageSize));

    return parseBokjiroPage(await this.http.getText(this.key.signed(url)), this.source);
  }

  protected toRecord(item: BokjiroItem): SourceRecord {
    return { externalId: item.servId ?? '', name: item.servNm ?? '', payload: item };
  }
}

// 복지로 중앙부처 복지서비스
export class BokjiroNationalFetcher extends BokjiroFetcher {
  readonly source = 'BOKJIRO_NATIONAL' as const;
  protected readonly listUrl = 'https://apis.data.go.kr/B554287/NationalWelfareInformationsV001/NationalWelfarelistV001';
  protected readonly fixedParams = { callTp: 'L', srchKeyCode: '001' };
}

// 복지로 지자체 복지서비스
export class BokjiroLocalFetcher extends BokjiroFetcher {
  readonly source = 'BOKJIRO_LOCAL' as const;
  protected readonly listUrl = 'https://apis.data.go.kr/B554287/LocalGovernmentWelfareInformations/LcgvWelfarelist';
}
