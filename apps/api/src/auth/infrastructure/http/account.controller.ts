import { Controller, Delete, Get, HttpCode, NotFoundException, Res, UseGuards } from '@nestjs/common';

import { AuthService } from '../../application/auth.service';
import { slugOf } from '../../domain/social-identity';

import { AuthCookies } from './auth-cookies';
import { CurrentUserId, LoggedInGuard } from './logged-in.guard';

import type { ServerResponse } from 'node:http';

// 마이페이지의 계정 정보와 탈퇴
@Controller('me/account')
@UseGuards(LoggedInGuard)
export class AccountController {
  constructor(
    private readonly auth: AuthService,
    private readonly cookies: AuthCookies,
  ) {}

  @Get()
  async find(@CurrentUserId() userId: string) {
    const account = await this.auth.accountOf(userId);
    if (!account) throw new NotFoundException();
    return { providers: account.providers.map(slugOf), joinedAt: account.joinedAt.toISOString() };
  }

  @Delete()
  @HttpCode(204)
  async withdraw(@CurrentUserId() userId: string, @Res({ passthrough: true }) response: ServerResponse) {
    await this.auth.withdraw(userId);
    response.setHeader('Set-Cookie', this.cookies.clearSession());
  }
}
