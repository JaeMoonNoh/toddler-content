import { RegionSource } from '../../ports/region-source';

import type { Region } from '../../../domain/region';

export class FakeRegionSource extends RegionSource {
  readonly name = '가짜 원본';

  constructor(private readonly response: Region[] | Error) {
    super();
  }

  async fetchAll() {
    if (this.response instanceof Error) throw this.response;
    return this.response;
  }
}
