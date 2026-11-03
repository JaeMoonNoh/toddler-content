import { Controller, Get } from '@nestjs/common';

import { RegionService } from '../../application/region.service';

@Controller('regions')
export class RegionsController {
  constructor(private readonly regions: RegionService) {}

  @Get()
  async list() {
    const { source, fetchedOn, regions } = await this.regions.directory();
    return {
      source,
      fetchedOn,
      regions: regions.map(({ code, name, fullName, parentCode }) => ({ code, name, fullName, parentCode })),
    };
  }
}
