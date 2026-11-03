import { join } from 'node:path';

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HttpClient } from '../../shared/infrastructure/http-client';
import { ServiceKey } from '../../shared/infrastructure/service-key';
import { RegionCatalog } from '../application/ports/region-catalog';
import { RegionSource } from '../application/ports/region-source';
import { RegionService } from '../application/region.service';

import { JsonRegionCatalog } from './catalog/json-region-catalog';
import { RegionsController } from './http/regions.controller';
import { StandardRegionSource } from './sources/standard-region-source';

// pnpm 스크립트와 Docker 모두 apps/api 폴더에서 실행된다
const REGIONS_PATH = join(process.cwd(), 'data/regions.json');

@Module({
  controllers: [RegionsController],
  providers: [
    RegionService,
    { provide: RegionCatalog, useFactory: () => new JsonRegionCatalog(REGIONS_PATH) },
    {
      provide: RegionSource,
      useFactory: (config: ConfigService) =>
        new StandardRegionSource(new HttpClient(), new ServiceKey(config.getOrThrow<string>('DATA_GO_KR_SERVICE_KEY'))),
      inject: [ConfigService],
    },
  ],
  exports: [RegionService],
})
export class RegionModule {}
