import type { AudienceGroup } from '../domain/audience';
import { BenefitCard } from './benefit-card';

// 대부분의 사람에게는 해당하지 않아서 접어 둔다. 펼치면 대상별로 볼 수 있다
export function AudienceGroups({ groups }: { groups: AudienceGroup[] }) {
  if (groups.length === 0) return null;
  const total = groups.reduce((sum, group) => sum + group.benefits.length, 0);
  return (
    <details className="audience">
      <summary>
        해당되면 확인하세요 <span>{total}건</span>
        <small>{groups.map((g) => `${g.label} ${g.benefits.length}`).join(' · ')}</small>
      </summary>
      {groups.map((group) => (
        <section key={group.audience} aria-label={group.label}>
          <h3 className="phase">
            {group.label} <span>{group.benefits.length}</span>
          </h3>
          <ul className="cards">
            {group.benefits.map((benefit) => (
              <BenefitCard key={benefit.slug} benefit={benefit} />
            ))}
          </ul>
        </section>
      ))}
    </details>
  );
}
