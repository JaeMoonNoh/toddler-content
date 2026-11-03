import { Module } from '@nestjs/common';

import { AppConfigModule } from '../../../config/app-config.module';
import { RegionModule } from '../region.module';

@Module({
  imports: [AppConfigModule, RegionModule],
})
export class RegionCliModule {}
