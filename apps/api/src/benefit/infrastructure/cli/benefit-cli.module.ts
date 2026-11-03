import { Module } from '@nestjs/common';

import { AppConfigModule } from '../../../config/app-config.module';
import { PrismaModule } from '../../../prisma/prisma.module';
import { BenefitModule } from '../benefit.module';

@Module({
  imports: [AppConfigModule, PrismaModule, BenefitModule],
})
export class BenefitCliModule {}
