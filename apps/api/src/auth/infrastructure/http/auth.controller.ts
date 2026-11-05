import { randomBytes } from 'node:crypto';

import { Controller, Get, HttpCode, Logger, NotFoundException, Param, Post, Query, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../../application/auth.service';
import { OAuthLoginError } from '../../application/ports/oauth-provider';
import { providerOf, slugOf, type SocialProvider } from '../../domain/social-identity';

import { AuthCookies, cookieOf, SESSION_COOKIE, STATE_COOKIE } from './auth-cookies';

import type { IncomingMessage, ServerResponse } from 'node:http';

const STATE_BYTES = 16;
const LOGIN_FAILED_PATH = '/?login=failed';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger('Auth');
  private readonly webOrigin: string;

  constructor(
    private readonly auth: AuthService,
    private readonly cookies: AuthCookies,
    config: ConfigService,
  ) {
    this.webOrigin = config.getOrThrow<string>('WEB_ORIGIN');
  }

  @Get('providers')
  providers() {
    return { providers: this.auth.availableProviders().map(slugOf) };
  }

  @Get('me')
  async me(@Req() request: IncomingMessage) {
    const token = cookieOf(request.headers.cookie, SESSION_COOKIE);
    const userId = token ? await this.auth.userIdOf(token, new Date()) : null;
    return { loggedIn: userId !== null };
  }

  @Get(':provider/login')
  login(@Param('provider') slug: string, @Res() response: ServerResponse) {
    const provider = this.availableProviderOf(slug);
    const state = randomBytes(STATE_BYTES).toString('base64url');
    response.setHeader('Set-Cookie', this.cookies.state(state));
    redirect(response, this.auth.loginUrl(provider, state));
  }

  // 카카오가 로그인 후 code와 state를 붙여 이 주소로 돌려보낸다. 사용자가 취소하면 error가 온다
  @Get(':provider/callback')
  async callback(
    @Param('provider') slug: string,
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Req() request: IncomingMessage,
    @Res() response: ServerResponse,
  ) {
    const provider = this.availableProviderOf(slug);
    const expectedState = cookieOf(request.headers.cookie, STATE_COOKIE);
    if (!code || !state || state !== expectedState) {
      this.logger.warn(`Login rejected: provider=${provider} reason=${code ? 'state-mismatch' : 'no-code'}`);
      response.setHeader('Set-Cookie', this.cookies.clearState());
      return redirect(response, this.webOrigin + LOGIN_FAILED_PATH);
    }

    try {
      const session = await this.auth.finishLogin(provider, code, new Date());
      response.setHeader('Set-Cookie', [this.cookies.clearState(), this.cookies.session(session.token, session.expiresAt)]);
      redirect(response, `${this.webOrigin}/`);
    } catch (error) {
      if (!(error instanceof OAuthLoginError)) throw error;
      this.logger.warn(`Login failed: provider=${provider} reason="${error.message}"`);
      response.setHeader('Set-Cookie', this.cookies.clearState());
      redirect(response, this.webOrigin + LOGIN_FAILED_PATH);
    }
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Req() request: IncomingMessage, @Res({ passthrough: true }) response: ServerResponse) {
    const token = cookieOf(request.headers.cookie, SESSION_COOKIE);
    if (token) await this.auth.logout(token);
    response.setHeader('Set-Cookie', this.cookies.clearSession());
  }

  private availableProviderOf(slug: string): SocialProvider {
    const provider = providerOf(slug);
    if (!provider || !this.auth.availableProviders().includes(provider)) throw new NotFoundException();
    return provider;
  }
}

function redirect(response: ServerResponse, location: string) {
  response.writeHead(302, { Location: location }).end();
}
