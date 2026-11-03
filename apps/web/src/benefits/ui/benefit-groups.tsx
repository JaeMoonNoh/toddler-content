import type { BenefitGroup } from '../domain/region';
import { BenefitCard } from './benefit-card';

export function BenefitGroups({ groups }: { groups: BenefitGroup[] }) {
  return groups.map((group) => (
    <section key={group.code} className="group" aria-labelledby={`group-${group.code}`}>
      <h3 id={`group-${group.code}`} className="phase">
        {group.label} <span>{group.benefits.length}</span>
      </h3>
      <ul className="cards">
        {group.benefits.map((benefit) => (
          <BenefitCard key={benefit.slug} benefit={benefit} />
        ))}
      </ul>
    </section>
  ));
}
