import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Put, UseGuards } from '@nestjs/common';

import { CurrentUserId, LoggedInGuard } from '../../../auth/infrastructure/http/logged-in.guard';
import { ConditionsService, ConsentRequiredError } from '../../application/conditions.service';
import { InvalidConditionsError } from '../../domain/saved-conditions';

import type { StoredConditions } from '../../application/ports/conditions-repository';

// 로그인한 사람의 조건. 저장은 동의한 뒤에만 한다
@Controller('me/conditions')
@UseGuards(LoggedInGuard)
export class ConditionsController {
  constructor(private readonly conditions: ConditionsService) {}

  @Get()
  async find(@CurrentUserId() userId: string) {
    return toResponse(await this.conditions.find(userId));
  }

  @Put()
  async save(@CurrentUserId() userId: string, @Body() body: unknown) {
    const { conditions, consent } = (body ?? {}) as { conditions?: unknown; consent?: unknown };
    try {
      return toResponse(await this.conditions.save(userId, conditions, consent === true, new Date()));
    } catch (error) {
      if (error instanceof InvalidConditionsError || error instanceof ConsentRequiredError) throw new BadRequestException(error.message);
      throw error;
    }
  }

  @Delete()
  @HttpCode(204)
  async delete(@CurrentUserId() userId: string) {
    await this.conditions.delete(userId);
  }
}

function toResponse(stored: null | StoredConditions) {
  if (!stored) return { conditions: null, consentedAt: null, updatedAt: null };
  return {
    conditions: stored.conditions.toJSON(),
    consentedAt: stored.consentedAt.toISOString(),
    updatedAt: stored.updatedAt.toISOString(),
  };
}
