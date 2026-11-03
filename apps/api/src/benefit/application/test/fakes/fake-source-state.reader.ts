import { CurrentSources, type SourceState } from '../../../domain/current-sources';
import { SourceStateReader } from '../../ports/source-state.reader';

import type { SourceRef } from '../../../domain/source-ref';

export class FakeSourceStateReader extends SourceStateReader {
  private readonly states = new Map<string, SourceState>();

  set(ref: SourceRef, hash = 'h1', payload: Record<string, unknown> = {}, removed = false) {
    this.states.set(ref.key, { ref, hash, payload, removed });
    return this;
  }

  remove(ref: SourceRef) {
    this.states.get(ref.key)!.removed = true;
    return this;
  }

  async read(refs: SourceRef[]): Promise<CurrentSources> {
    return new CurrentSources(refs.flatMap((ref) => this.states.get(ref.key) ?? []));
  }
}
