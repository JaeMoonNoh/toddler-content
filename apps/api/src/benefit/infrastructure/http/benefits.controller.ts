import { Controller, Get } from '@nestjs/common';
import { ListPublishedBenefitsUseCase } from '../../application/list-published-benefits.use-case';

@Controller('benefits')
export class BenefitsController {
  constructor(private readonly listPublished: ListPublishedBenefitsUseCase) {}

  @Get()
  list() {
    return this.listPublished.execute();
  }
}
