import { describe, expect, it } from 'vitest';

import { OAuthLoginError } from '../../application/ports/oauth-provider';
import { type FormFetch, KakaoOAuthProvider } from '../providers/kakao-oauth-provider';

const settings = { restApiKey: 'rest-key', clientSecret: null, redirectUri: 'http://localhost:3000/api/auth/kakao/callback' };

// 카카오 대신 받은 요청을 적어 두고 정해 둔 응답을 돌려준다
function fakeKakao(responses: Record<string, () => Response>) {
  const requests: { url: string; init: RequestInit }[] = [];
  const send: FormFetch = async (url, init) => {
    requests.push({ url, init });
    const respond = Object.entries(responses).find(([prefix]) => url.startsWith(prefix))?.[1];
    if (!respond) throw new TypeError('fetch failed');
    return respond();
  };
  return { requests, send };
}

const json =
  (body: unknown, status = 200) =>
  () =>
    new Response(JSON.stringify(body), { status });
const TOKEN = 'https://kauth.kakao.com/oauth/token';
const USER = 'https://kapi.kakao.com/v2/user/me';

describe('KakaoOAuthProvider', () => {
  it('로그인 주소에 REST 키, 돌아올 주소, state를 넣는다', () => {
    const url = new URL(new KakaoOAuthProvider(settings).authorizeUrl('abc'));
    expect(url.origin + url.pathname).toBe('https://kauth.kakao.com/oauth/authorize');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      client_id: 'rest-key',
      redirect_uri: settings.redirectUri,
      response_type: 'code',
      state: 'abc',
    });
  });

  it('code로 토큰을 받고 회원번호만 꺼낸다', async () => {
    const kakao = fakeKakao({
      [TOKEN]: json({ access_token: 'at' }),
      [USER]: json({ id: 4242, kakao_account: { profile: { nickname: '홍길동' } } }),
    });
    const identity = await new KakaoOAuthProvider(settings, kakao.send).identityOf('the-code');

    expect(identity).toEqual({ provider: 'KAKAO', providerUserId: '4242' });
    expect(Object.fromEntries(new URLSearchParams(kakao.requests[0].init.body as string))).toEqual({
      grant_type: 'authorization_code',
      client_id: 'rest-key',
      redirect_uri: settings.redirectUri,
      code: 'the-code',
    });
    expect(kakao.requests[1].init.headers).toEqual({ Authorization: 'Bearer at' });
  });

  it('Client Secret을 켰으면 토큰 요청에 넣는다', async () => {
    const kakao = fakeKakao({ [TOKEN]: json({ access_token: 'at' }), [USER]: json({ id: 1 }) });
    await new KakaoOAuthProvider({ ...settings, clientSecret: 'secret' }, kakao.send).identityOf('c');
    expect(new URLSearchParams(kakao.requests[0].init.body as string).get('client_secret')).toBe('secret');
  });

  it('토큰 발급이 거절되면 카카오 오류 코드만 담아 실패한다 (code는 넣지 않는다)', async () => {
    const kakao = fakeKakao({ [TOKEN]: json({ error: 'invalid_grant', error_code: 'KOE320' }, 400) });
    const failure = new KakaoOAuthProvider(settings, kakao.send).identityOf('secret-code');

    await expect(failure).rejects.toThrow(OAuthLoginError);
    await expect(failure).rejects.toThrow('카카오 토큰 발급: HTTP 400 invalid_grant KOE320');
  });

  it('사용자 조회에 회원번호가 없으면 실패한다', async () => {
    const kakao = fakeKakao({ [TOKEN]: json({ access_token: 'at' }), [USER]: json({}) });
    await expect(new KakaoOAuthProvider(settings, kakao.send).identityOf('c')).rejects.toThrow('회원번호가 없습니다');
  });

  it('응답이 JSON이 아니어도 상태 코드로 실패를 알린다', async () => {
    const kakao = fakeKakao({ [TOKEN]: () => new Response('<html>', { status: 502 }) });
    await expect(new KakaoOAuthProvider(settings, kakao.send).identityOf('c')).rejects.toThrow('카카오 토큰 발급: HTTP 502');
  });

  it('네트워크 오류는 로그인 실패로 바꾼다', async () => {
    await expect(new KakaoOAuthProvider(settings, fakeKakao({}).send).identityOf('c')).rejects.toThrow('카카오 토큰 발급: 네트워크 오류');
  });

  it('시간 초과를 알린다', async () => {
    const send: FormFetch = async () => {
      throw new DOMException('timed out', 'TimeoutError');
    };
    await expect(new KakaoOAuthProvider(settings, send).identityOf('c')).rejects.toThrow('응답 없음');
  });
});
