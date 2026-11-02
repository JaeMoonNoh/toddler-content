import { describe, expect, it } from 'vitest';
import { FakeFetch, networkError, timeoutError } from '../fakes/fake-fetch';
import { HttpClient, HttpError, redactUrl } from './http-client';

const url = new URL('https://api.example.kr/list?page=1&serviceKey=SECRET-KEY');
const any = () => true;
const failureOf = (p: Promise<unknown>) =>
  p.then(
    () => {
      throw new Error('실패해야 하는데 성공함');
    },
    (e: Error) => e,
  );

function clientWith(fake: FakeFetch, retries = 2) {
  const waits: number[] = [];
  const client = new HttpClient(fake.fetch, { retries, retryDelayMs: 100, sleep: async (ms) => void waits.push(ms) });
  return { client, waits };
}

describe('redactUrl', () => {
  it('인증키 값을 가린다', () => {
    expect(redactUrl(url)).toBe('https://api.example.kr/list?page=1&serviceKey=***');
  });

  it('인증키가 없는 주소는 그대로 둔다', () => {
    expect(redactUrl(new URL('https://a.kr/x?page=2'))).toBe('https://a.kr/x?page=2');
  });
});

describe('HttpClient', () => {
  it('성공하면 본문을 돌려준다', async () => {
    const { client } = clientWith(new FakeFetch().on(any, { body: 'ok' }));
    expect(await client.getText(url)).toBe('ok');
  });

  it('5xx는 재시도해서 성공하면 본문을 돌려준다', async () => {
    const fake = new FakeFetch().on(any, { status: 503, body: '' }, { body: 'ok' });
    const { client, waits } = clientWith(fake);

    expect(await client.getText(url)).toBe('ok');
    expect(fake.requests).toHaveLength(2);
    expect(waits).toEqual([100]);
  });

  it('재시도할수록 기다리는 시간이 늘어난다', async () => {
    const fake = new FakeFetch().on(any, networkError(), networkError(), { body: 'ok' });
    const { client, waits } = clientWith(fake);

    await client.getText(url);
    expect(waits).toEqual([100, 200]);
  });

  it('429(요청 과다)도 재시도한다', async () => {
    const fake = new FakeFetch().on(any, { status: 429, body: '' }, { body: 'ok' });
    expect(await clientWith(fake).client.getText(url)).toBe('ok');
  });

  it('4xx는 재시도하지 않는다', async () => {
    const fake = new FakeFetch().on(any, { status: 401, body: '{"msg":"등록되지 않은 인증키"}' });
    const { client } = clientWith(fake);

    await expect(client.getText(url)).rejects.toBeInstanceOf(HttpError);
    expect(fake.requests).toHaveLength(1);
  });

  it('재시도 횟수를 넘기면 마지막 오류를 던진다', async () => {
    const fake = new FakeFetch().on(any, { status: 500, body: 'down' });
    const { client } = clientWith(fake, 2);

    await expect(client.getText(url)).rejects.toThrow('HTTP 500');
    expect(fake.requests).toHaveLength(3);
  });

  it('재시도 0회면 한 번만 요청한다', async () => {
    const fake = new FakeFetch().on(any, { status: 500, body: '' });
    await expect(clientWith(fake, 0).client.getText(url)).rejects.toThrow();
    expect(fake.requests).toHaveLength(1);
  });

  it('시간 초과는 알아볼 수 있는 메시지로 바꾼다', async () => {
    const fake = new FakeFetch().on(any, timeoutError());
    await expect(clientWith(fake, 0).client.getText(url)).rejects.toThrow('응답 없음');
  });

  describe('오류 메시지에 인증키가 들어가지 않는다', () => {
    it('HTTP 오류', async () => {
      const fake = new FakeFetch().on(any, { status: 401, body: 'unauthorized' });
      const error = await failureOf(clientWith(fake).client.getText(url));
      expect(error.message).not.toContain('SECRET-KEY');
      expect(error.message).toContain('serviceKey=***');
    });

    it('네트워크 오류', async () => {
      const fake = new FakeFetch().on(any, networkError());
      const error = await failureOf(clientWith(fake, 0).client.getText(url));
      expect(error.message).not.toContain('SECRET-KEY');
    });
  });

  it('여러 줄 오류 본문(공공데이터포털 403 XML)은 한 줄로 담는다', async () => {
    const body = '<?xml version="1.0"?>\n<OpenAPI_ServiceResponse>\n  <cmmMsgHeader>\n    <errMsg>SERVICE_KEY_IS_NOT_REGISTERED_ERROR</errMsg>';
    const fake = new FakeFetch().on(any, { status: 403, body });
    const error = await failureOf(clientWith(fake).client.getText(url));

    expect(error.message).not.toContain('\n');
    expect(error.message).toContain('<cmmMsgHeader> <errMsg>SERVICE_KEY_IS_NOT_REGISTERED_ERROR');
  });

  it('긴 오류 본문은 잘라서 담는다', async () => {
    const fake = new FakeFetch().on(any, { status: 400, body: 'x'.repeat(5000) });
    const error = await failureOf(clientWith(fake).client.getText(url));
    expect(error.message.length).toBeLessThan(400);
  });
});
