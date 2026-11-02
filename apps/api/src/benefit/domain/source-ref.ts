import type { SourceId } from '../../collect/domain/source-record';

// 혜택이 가리키는 공공 API 원본 한 건 (출처 + 출처의 ID)
export class SourceRef {
  constructor(
    readonly source: SourceId,
    readonly externalId: string,
  ) {}

  get key() {
    return `${this.source}:${this.externalId}`;
  }

  get label() {
    return this.source === 'GOV24' ? '보조금24' : '복지로';
  }

  equals(other: SourceRef) {
    return this.key === other.key;
  }
}
