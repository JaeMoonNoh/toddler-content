import { describe, expect, it } from 'vitest';
import { FakeFetch } from './fakes/fake-fetch';
import { HttpClient } from '../http/http-client';
import { ServiceKey } from '../sources/service-key';
import { Gov24Fetcher } from '../sources/gov24/gov24.fetcher';

const key = new ServiceKey('TEST-KEY');
const service = (id: string, extra: Record<string, unknown> = {}) => ({ 서비스ID: id, 서비스명: `혜택 ${id}`, 조회수: 3, ...extra });
const page = (data: unknown[], totalCount: number) => ({ body: JSON.stringify({ page: 1, perPage: 1000, totalCount, currentCount: data.length, data }) });
const pageParam = (n: number) => (url: URL) => url.searchParams.get('page') === String(n);

function fetcherWith(fake: FakeFetch) {
  return new Gov24Fetcher(new HttpClient(fake.fetch, { retries: 0 }), key);
}

describe('Gov24Fetcher', () => {
  it('서비스ID와 서비스명으로 원본을 만들고, 응답 전체를 그대로 담는다', async () => {
    const fake = new FakeFetch().on(pageParam(1), page([service('A1', { 지원내용: '월 10만원' })], 1));

    expect(await fetcherWith(fake).fetchAll()).toEqual([
      { externalId: 'A1', name: '혜택 A1', payload: { 서비스ID: 'A1', 서비스명: '혜택 A1', 조회수: 3, 지원내용: '월 10만원' } },
    ]);
  });

  it('페이지당 1000건씩, 인증키를 붙여 요청한다', async () => {
    const fake = new FakeFetch().on(pageParam(1), page([service('A1')], 1));
    await fetcherWith(fake).fetchAll();

    const [request] = fake.requests;
    expect(request.pathname).toBe('/api/gov24/v3/serviceList');
    expect(request.searchParams.get('perPage')).toBe('1000');
    expect(request.searchParams.get('serviceKey')).toBe('TEST-KEY');
  });

  it('1001건이면 두 페이지를 요청한다', async () => {
    const first = Array.from({ length: 1000 }, (_, i) => service(String(i)));
    const fake = new FakeFetch().on(pageParam(1), page(first, 1001)).on(pageParam(2), page([service('last')], 1001));

    expect(await fetcherWith(fake).fetchAll()).toHaveLength(1001);
    expect(fake.requests.map((r) => r.searchParams.get('page'))).toEqual(['1', '2']);
  });

  it('조회수는 비교에서 빼도록 알려준다', () => {
    expect(fetcherWith(new FakeFetch()).ignoredFields).toEqual(['조회수']);
  });

  it('인증키가 틀리면 HTTP 오류를 알려준다', async () => {
    const fake = new FakeFetch().on(pageParam(1), { status: 401, body: '{"code":-4,"msg":"등록되지 않은 인증키 입니다."}' });
    await expect(fetcherWith(fake).fetchAll()).rejects.toThrow('등록되지 않은 인증키');
  });

  it('JSON이 아닌 응답이면 실패한다', async () => {
    const fake = new FakeFetch().on(pageParam(1), { body: '<html>점검 중</html>' });
    await expect(fetcherWith(fake).fetchAll()).rejects.toThrow('JSON이 아닌 응답');
  });

  it('data나 totalCount가 없는 응답이면 실패한다', async () => {
    const fake = new FakeFetch().on(pageParam(1), { body: '{"currentCount":0}' });
    await expect(fetcherWith(fake).fetchAll()).rejects.toThrow('예상과 다른 응답');
  });

  it('서비스ID가 숫자로 와도 문자열 ID로 다룬다', async () => {
    const fake = new FakeFetch().on(pageParam(1), page([{ 서비스ID: 105100000001, 서비스명: 'A' }], 1));
    expect((await fetcherWith(fake).fetchAll())[0].externalId).toBe('105100000001');
  });

  it('서비스ID가 없는 항목이 있으면 실패한다', async () => {
    const fake = new FakeFetch().on(pageParam(1), page([{ 서비스명: 'ID 없음' }], 1));
    await expect(fetcherWith(fake).fetchAll()).rejects.toThrow('ID가 없는 항목');
  });
});
