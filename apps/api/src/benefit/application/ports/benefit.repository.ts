import type { Benefit } from '../../domain/benefit';

export abstract class BenefitRepository {
  abstract findAll(): Promise<Benefit[]>;
  abstract findBySlugs(slugs: string[]): Promise<Benefit[]>;
  abstract saveAll(benefits: Benefit[]): Promise<void>;
}
