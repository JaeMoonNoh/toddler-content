import type { PublishedBenefit } from '../domain/benefit';
import { BenefitChips } from './benefit-chips';

export function BenefitCard({ benefit }: { benefit: PublishedBenefit }) {
  return (
    <li className="card">
      <BenefitChips benefit={benefit} />
      <h3>{benefit.name}</h3>
      <div className="meta">
        <span>출처 {benefit.sourceName}</span>
        <a href={benefit.sourceUrl} target="_blank" rel="noopener noreferrer">
          원문 보기
        </a>
      </div>
    </li>
  );
}
