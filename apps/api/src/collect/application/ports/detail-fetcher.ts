import type { DetailSourceId } from '../../../shared/domain/source-id';
import type { SourceRecord } from '../../domain/source-record';

// 출처 항목 한 건의 상세(본문)를 받는다
export abstract class DetailFetcher {
  abstract readonly source: DetailSourceId;

  abstract fetchDetail(externalId: string): Promise<SourceRecord>;
}

// Nest가 상세 출처 목록을 주입할 때 쓰는 토큰
export const DETAIL_FETCHERS = Symbol('DETAIL_FETCHERS');
