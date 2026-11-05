import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';

import { CurrentUserId, LoggedInGuard } from '../../../auth/infrastructure/http/logged-in.guard';
import { SavedBenefitService } from '../../application/saved-benefit.service';
import { InvalidSavedBenefitError } from '../../domain/saved-benefit';

// 로그인한 사람의 저장한 혜택. 로그인하지 않은 사람은 브라우저에만 저장한다
@Controller('me/saved-benefits')
@UseGuards(LoggedInGuard)
export class SavedBenefitsController {
  constructor(private readonly saved: SavedBenefitService) {}

  @Get()
  async list(@CurrentUserId() userId: string) {
    return { items: await this.saved.list(userId) };
  }

  @Put(':slug')
  async set(@CurrentUserId() userId: string, @Param('slug') slug: string, @Body() body: unknown) {
    return rejectInvalid(() => this.saved.set(userId, slug, (body as { state?: unknown } | null)?.state, new Date()));
  }

  @Delete(':slug')
  @HttpCode(204)
  async remove(@CurrentUserId() userId: string, @Param('slug') slug: string) {
    await this.saved.remove(userId, slug);
  }

  @Post('merge')
  @HttpCode(200)
  async merge(@CurrentUserId() userId: string, @Body() body: unknown) {
    return {
      items: await rejectInvalid(() => this.saved.mergeFromDevice(userId, (body as { items?: unknown } | null)?.items, new Date())),
    };
  }
}

async function rejectInvalid<T>(action: () => Promise<T>): Promise<T> {
  try {
    return await action();
  } catch (error) {
    if (error instanceof InvalidSavedBenefitError) throw new BadRequestException(error.message);
    throw error;
  }
}
