import { Controller, Get } from '@nestjs/common';
import { PublishedBenefitService } from '../../application/published-benefit.service';

@Controller('benefits')
export class BenefitsController {
  constructor(private readonly publishedBenefits: PublishedBenefitService) {}

  @Get()
  list() {
    return this.publishedBenefits.list();
  }
}
