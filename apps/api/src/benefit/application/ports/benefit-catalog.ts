import type { BenefitDetails } from '../../domain/benefit';

// 사이트에 올리기로 정한 혜택 목록 (사람이 관리하는 원본 목록)
export abstract class BenefitCatalog {
  abstract load(): Promise<BenefitDetails[]>;
}
