import type { FailedDetail, RefreshedDetail } from '../detail-refresh-report';

// 상세를 한 건 받을 때마다 바깥에 알린다. 서버에서는 로그로 남긴다
export abstract class DetailEvents {
  abstract refreshed(detail: RefreshedDetail): void;
  abstract failed(detail: FailedDetail): void;
}
