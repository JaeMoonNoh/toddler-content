import type { Benefit } from '../../domain/benefit';
import { BenefitRepository } from '../ports/benefit.repository';

export class InMemoryBenefitRepository extends BenefitRepository {
  benefits = new Map<string, Benefit>();
  saveCount = 0;
  deleteCount = 0;

  constructor(initial: Benefit[] = []) {
    super();
    initial.forEach((benefit) => this.benefits.set(benefit.slug, benefit));
  }

  async findAll(): Promise<Benefit[]> {
    return [...this.benefits.values()];
  }

  async findBySlugs(slugs: string[]): Promise<Benefit[]> {
    return slugs.flatMap((slug) => this.benefits.get(slug) ?? []);
  }

  async saveAll(benefits: Benefit[]): Promise<void> {
    this.saveCount++;
    benefits.forEach((benefit) => this.benefits.set(benefit.slug, benefit));
  }

  async deleteBySlugs(slugs: string[]): Promise<void> {
    this.deleteCount++;
    slugs.forEach((slug) => this.benefits.delete(slug));
  }
}
