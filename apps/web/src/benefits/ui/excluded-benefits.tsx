import type { ExcludedBenefit } from '../domain/eligibility';

export function ExcludedBenefits({ excluded }: { excluded: ExcludedBenefit[] }) {
  if (excluded.length === 0) return null;
  return (
    <details className="excl">
      <summary>조건이 맞지 않아 뺀 혜택 {excluded.length}건</summary>
      <ul>
        {excluded.map(({ benefit, reasons }) => (
          <li key={benefit.slug}>
            {benefit.name} <span>(조건: {reasons.join(', ')})</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
