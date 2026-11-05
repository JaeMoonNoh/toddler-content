import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../application/auth.service';
import { OAuthProviders } from '../application/oauth-providers';
import { AccountRepository } from '../application/ports/account-repository';
import { SessionStore } from '../application/ports/session-store';

import { AuthCookies } from './http/auth-cookies';
import { AuthController } from './http/auth.controller';
import { PrismaAccountRepository } from './persistence/prisma-account.repository';
import { PrismaSessionStore } from './persistence/prisma-session.store';
import { KakaoOAuthProvider } from './providers/kakao-oauth-provider';

// 로그인은 웹 주소를 거쳐 들어온다 (웹이 /api/*를 API로 넘긴다). 그래서 쿠키와 돌아올 주소가 모두 웹 주소 기준이다
const callbackUrl = (config: ConfigService, slug: string) => `${config.getOrThrow<string>('WEB_ORIGIN')}/api/auth/${slug}/callback`;

// 키를 넣은 수단만 켠다. 새 수단은 여기에 구현을 하나 더 넣는다
function configuredProviders(config: ConfigService) {
  const kakaoKey = config.get<string>('KAKAO_REST_API_KEY');
  return [
    ...(kakaoKey
      ? [
          new KakaoOAuthProvider({
            restApiKey: kakaoKey,
            clientSecret: config.get<string>('KAKAO_CLIENT_SECRET') ?? null,
            redirectUri: callbackUrl(config, 'kakao'),
          }),
        ]
      : []),
  ];
}

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: OAuthProviders,
      useFactory: (config: ConfigService) => new OAuthProviders(configuredProviders(config)),
      inject: [ConfigService],
    },
    { provide: AccountRepository, useClass: PrismaAccountRepository },
    { provide: SessionStore, useClass: PrismaSessionStore },
    {
      provide: AuthCookies,
      useFactory: (config: ConfigService) => new AuthCookies(config.getOrThrow<string>('WEB_ORIGIN').startsWith('https://')),
      inject: [ConfigService],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
