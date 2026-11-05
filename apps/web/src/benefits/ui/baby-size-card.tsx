import type { BabySize } from '../domain/baby-size';
import { withTopicParticle } from '../domain/child-name';

export function BabySizeCard({ size, callName, weeks }: { size: BabySize; callName: string; weeks: number | null }) {
  return (
    <div className="baby" aria-live="polite">
      <span className="baby-fruit" aria-hidden="true">
        {size.emoji}
      </span>
      <p>
        {withTopicParticle(callName)} 지금 <b>{size.fruit}</b>만 해요
        <small>{weeks === null ? '곧 만나요' : `임신 ${weeks}주`} · 크기는 대략이에요</small>
      </p>
    </div>
  );
}
