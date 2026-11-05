import { Module } from '@nestjs/common';

import { AuthModule } from '../../auth/infrastructure/auth.module';
import { SavedBenefitRepository } from '../application/ports/saved-benefit-repository';
import { SavedBenefitService } from '../application/saved-benefit.service';

import { SavedBenefitsController } from './http/saved-benefits.controller';
import { PrismaSavedBenefitRepository } from './persistence/prisma-saved-benefit.repository';

@Module({
  imports: [AuthModule],
  controllers: [SavedBenefitsController],
  providers: [SavedBenefitService, { provide: SavedBenefitRepository, useClass: PrismaSavedBenefitRepository }],
})
export class SavedBenefitModule {}
