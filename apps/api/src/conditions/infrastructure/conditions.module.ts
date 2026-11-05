import { Module } from '@nestjs/common';

import { AuthModule } from '../../auth/infrastructure/auth.module';
import { ConditionsService } from '../application/conditions.service';
import { ConditionsRepository } from '../application/ports/conditions-repository';

import { ConditionsController } from './http/conditions.controller';
import { PrismaConditionsRepository } from './persistence/prisma-conditions.repository';

@Module({
  imports: [AuthModule],
  controllers: [ConditionsController],
  providers: [ConditionsService, { provide: ConditionsRepository, useClass: PrismaConditionsRepository }],
})
export class ConditionsModule {}
