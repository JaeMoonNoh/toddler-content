import type { BenefitDetails } from '../../../domain/benefit';
import { BenefitCatalog } from '../../ports/benefit-catalog';

export class FakeBenefitCatalog extends BenefitCatalog {
  constructor(public entries: BenefitDetails[] = []) {
    super();
  }

  async load(): Promise<BenefitDetails[]> {
    return this.entries;
  }
}
