import type { BenefitDetails } from '../../domain/benefit';

// 사이트에 올리기로 정한 혜택 목록 (사람이 관리하는 원본 목록)
export abstract class BenefitCatalog {
  abstract load(): Promise<BenefitDetails[]>;
  // 같은 slug의 혜택을 바꾼다. 목록 순서와 나머지 혜택은 그대로 둔다
  abstract update(entries: BenefitDetails[]): Promise<void>;
  // 새 혜택을 목록 끝에 붙인다
  abstract add(entries: BenefitDetails[]): Promise<void>;
}
