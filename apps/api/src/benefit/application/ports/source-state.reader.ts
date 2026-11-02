import type { CurrentSources } from '../../domain/current-sources';
import type { SourceRef } from '../../domain/source-ref';

// 수집기가 저장해 둔 원본의 지금 모습을 읽는다
export abstract class SourceStateReader {
  abstract read(refs: SourceRef[]): Promise<CurrentSources>;
}
