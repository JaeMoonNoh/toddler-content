import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../prisma/prisma.module';
import { BenefitModule } from '../benefit.module';

@Module({
  imports: [PrismaModule, BenefitModule],
})
export class BenefitCliModule {}
