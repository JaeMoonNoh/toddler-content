import { type CanActivate, createParamDecorator, type ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../../application/auth.service';

import { cookieOf, SESSION_COOKIE } from './auth-cookies';

import type { IncomingMessage } from 'node:http';

type AuthenticatedRequest = IncomingMessage & { userId?: string };

// 로그인한 사람만 들어올 수 있는 경로에 붙인다. 통과하면 @CurrentUserId()로 계정 ID를 꺼낸다
@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = cookieOf(request.headers.cookie, SESSION_COOKIE);
    const userId = token ? await this.auth.userIdOf(token, new Date()) : null;
    if (!userId) throw new UnauthorizedException();
    request.userId = userId;
    return true;
  }
}

export const CurrentUserId = createParamDecorator((_: unknown, context: ExecutionContext): string => {
  const { userId } = context.switchToHttp().getRequest<AuthenticatedRequest>();
  if (!userId) throw new UnauthorizedException();
  return userId;
});
