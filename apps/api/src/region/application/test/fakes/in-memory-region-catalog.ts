import { RegionCatalog } from '../../ports/region-catalog';

import type { RegionDirectory } from '../../../domain/region';

export class InMemoryRegionCatalog extends RegionCatalog {
  constructor(public directory: RegionDirectory | null = null) {
    super();
  }

  async load() {
    return this.directory;
  }

  async save(directory: RegionDirectory) {
    this.directory = directory;
  }
}
