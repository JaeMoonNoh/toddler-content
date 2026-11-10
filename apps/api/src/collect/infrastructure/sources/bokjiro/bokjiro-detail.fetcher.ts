import { DetailFetcher } from '../../../application/ports/detail-fetcher';
import { SourceFormatError } from '../paged-source-fetcher';

import { type BokjiroDetail, parseBokjiroDetail } from './bokjiro-response';

import type { HttpClient } from '../../../../shared/infrastructure/http-client';
import type { ServiceKey } from '../../../../shared/infrastructure/service-key';
import type { SourceRecord } from '../../../domain/source-record';

// 복지로 상세 API 공통. 중앙부처와 지자체는 주소와 고정 파라미터만 다르다.
abstract class BokjiroDetailFetcher extends DetailFetcher {
  protected abstract readonly detailUrl: string;
  protected readonly fixedParams: Record<string, string> = {};

  constructor(
    private readonly http: HttpClient,
    private readonly key: ServiceKey,
  ) {
    super();
  }

  async fetchDetail(externalId: string): Promise<SourceRecord> {
    const url = new URL(this.detailUrl);
    for (const [name, value] of Object.entries(this.fixedParams)) url.searchParams.set(name, value);
    url.searchParams.set('servId', externalId);

    const detail = parseBokjiroDetail(await this.http.getText(this.key.signed(url)), this.source);
    const servId = textOf(detail.servId);
    if (servId !== externalId) {
      throw new SourceFormatError(`${this.source}: ${externalId}를 요청했는데 다른 항목이 왔습니다 (${servId || '없음'})`);
    }
    return { externalId, name: textOf(detail.servNm), payload: detail };
  }
}

// 복지로 중앙부처 복지서비스 상세
export class BokjiroNationalDetailFetcher extends BokjiroDetailFetcher {
  readonly source = 'BOKJIRO_NATIONAL' as const;
  protected readonly detailUrl = 'https://apis.data.go.kr/B554287/NationalWelfareInformationsV001/NationalWelfaredetailedV001';
  protected readonly fixedParams = { callTp: 'D' };
}

// 복지로 지자체 복지서비스 상세
export class BokjiroLocalDetailFetcher extends BokjiroDetailFetcher {
  readonly source = 'BOKJIRO_LOCAL' as const;
  protected readonly detailUrl = 'https://apis.data.go.kr/B554287/LocalGovernmentWelfareInformations/LcgvWelfaredetailed';
}

function textOf(value: BokjiroDetail[string] | undefined): string {
  return typeof value === 'string' ? value : '';
}
