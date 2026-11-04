import { BenefitCatalog } from '../../ports/benefit-catalog';

import type { BenefitDetails } from '../../../domain/benefit';

export class FakeBenefitCatalog extends BenefitCatalog {
  constructor(public entries: BenefitDetails[] = []) {
    super();
  }

  async load(): Promise<BenefitDetails[]> {
    return this.entries;
  }

  async update(entries: BenefitDetails[]): Promise<void> {
    const bySlug = new Map(entries.map((entry) => [entry.slug, entry]));
    this.entries = this.entries.map((entry) => bySlug.get(entry.slug) ?? entry);
  }

  async add(entries: BenefitDetails[]): Promise<void> {
    this.entries = [...this.entries, ...entries];
  }
}
