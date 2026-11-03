import { describe, expect, it } from 'vitest';

import { HttpClient } from '../http/http-client';
import { BokjiroLocalFetcher, BokjiroNationalFetcher } from '../sources/bokjiro/bokjiro.fetcher';
import { ServiceKey } from '../sources/service-key';

import { FakeFetch } from './fakes/fake-fetch';

const key = new ServiceKey('TEST-KEY');
const serv = (id: string, extra = '') =>
  `<servList><servId>${id}</servId><servNm>혜택 ${id}</servNm><inqNum>12</inqNum>${extra}</servList>`;
const wanted = (totalCount: number, ...items: string[]) => ({
  body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><wantedList><totalCount>${totalCount}</totalCount><pageNo>1</pageNo><numOfRows>500</numOfRows><resultCode>0</resultCode><resultMessage>SUCCESS</resultMessage>${items.join('')}</wantedList>`,
});
const any = () => true;
const pageNo = (n: number) => (url: URL) => url.searchParams.get('pageNo') === String(n);

function national(fake: FakeFetch) {
  return new BokjiroNationalFetcher(new HttpClient(fake.fetch, { retries: 0 }), key);
}

describe('복지로 fetcher', () => {
  it('servId와 servNm으로 원본을 만들고, 모든 값을 문자열로 담는다', async () => {
    const fake = new FakeFetch().on(any, wanted(1, serv('WLF00001188', '<sprtCycNm>월</sprtCycNm>')));

    expect(await national(fake).fetchAll()).toEqual([
      {
        externalId: 'WLF00001188',
        name: '혜택 WLF00001188',
        payload: { servId: 'WLF00001188', servNm: '혜택 WLF00001188', inqNum: '12', sprtCycNm: '월' },
      },
    ]);
  });

  it('항목이 1건뿐이어도 목록으로 읽는다', async () => {
    const fake = new FakeFetch().on(any, wanted(1, serv('A')));
    expect(await national(fake).fetchAll()).toHaveLength(1);
  });

  it('앞자리 0이 있는 값도 숫자로 바꾸지 않는다', async () => {
    const fake = new FakeFetch().on(any, wanted(1, serv('A', '<lifeArray>001,007</lifeArray><ctpvCd>0043</ctpvCd>')));
    expect((await national(fake).fetchAll())[0].payload).toMatchObject({ ctpvCd: '0043', lifeArray: '001,007' });
  });

  it('&amp; 같은 XML 문자는 원래 글자로 바꾼다', async () => {
    const fake = new FakeFetch().on(any, wanted(1, serv('A', '<servDtlLink>https://b.kr?x=1&amp;y=2</servDtlLink>')));
    expect((await national(fake).fetchAll())[0].payload.servDtlLink).toBe('https://b.kr?x=1&y=2');
  });

  it('조회수(inqNum)는 비교에서 빼도록 알려준다', () => {
    expect(national(new FakeFetch()).ignoredFields).toEqual(['inqNum']);
  });

  it('중앙부처는 목록 조회 고정 파라미터를 붙여 요청한다', async () => {
    const fake = new FakeFetch().on(any, wanted(1, serv('A')));
    await national(fake).fetchAll();

    const [request] = fake.requests;
    expect(request.pathname).toContain('NationalWelfarelistV001');
    expect(Object.fromEntries(request.searchParams)).toMatchObject({ callTp: 'L', srchKeyCode: '001', numOfRows: '500', pageNo: '1' });
  });

  it('지자체는 지자체 목록 주소로 페이지를 넘기며 요청한다', async () => {
    const first = Array.from({ length: 500 }, (_, i) => serv(`L${i}`));
    const fake = new FakeFetch().on(pageNo(1), wanted(501, ...first)).on(pageNo(2), wanted(501, serv('L500')));

    const records = await new BokjiroLocalFetcher(new HttpClient(fake.fetch, { retries: 0 }), key).fetchAll();

    expect(records).toHaveLength(501);
    expect(fake.requests.every((r) => r.pathname.endsWith('LcgvWelfarelist'))).toBe(true);
  });

  it('0건이면 빈 목록을 돌려준다', async () => {
    const fake = new FakeFetch().on(any, wanted(0));
    expect(await national(fake).fetchAll()).toEqual([]);
  });

  describe('오류 응답', () => {
    it('인증키 오류(게이트웨이)는 HTTP 200이어도 실패로 본다', async () => {
      const fake = new FakeFetch().on(any, {
        body: '<OpenAPI_ServiceResponse><cmmMsgHeader><errMsg>SERVICE ERROR</errMsg><returnAuthMsg>SERVICE_KEY_IS_NOT_REGISTERED_ERROR</returnAuthMsg><returnReasonCode>30</returnReasonCode></cmmMsgHeader></OpenAPI_ServiceResponse>',
      });
      await expect(national(fake).fetchAll()).rejects.toThrow('SERVICE_KEY_IS_NOT_REGISTERED_ERROR (코드 30)');
    });

    it('하루 호출 한도 초과도 실패로 본다', async () => {
      const fake = new FakeFetch().on(any, {
        body: '<OpenAPI_ServiceResponse><cmmMsgHeader><returnAuthMsg>LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR</returnAuthMsg><returnReasonCode>22</returnReasonCode></cmmMsgHeader></OpenAPI_ServiceResponse>',
      });
      await expect(national(fake).fetchAll()).rejects.toThrow('LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR');
    });

    it('resultCode가 0이 아니면 실패로 본다', async () => {
      const fake = new FakeFetch().on(any, {
        body: '<wantedList><totalCount>0</totalCount><resultCode>99</resultCode><resultMessage>잘못된 요청</resultMessage></wantedList>',
      });
      await expect(national(fake).fetchAll()).rejects.toThrow('잘못된 요청 (코드 99)');
    });

    it('XML이 아니면 실패로 본다', async () => {
      const fake = new FakeFetch().on(any, { body: 'Unexpected errors' });
      await expect(national(fake).fetchAll()).rejects.toThrow('XML이 아닌 응답');
    });

    it('모르는 XML 모양이면 실패로 본다', async () => {
      const fake = new FakeFetch().on(any, { body: '<html><body>점검 중</body></html>' });
      await expect(national(fake).fetchAll()).rejects.toThrow('예상과 다른 응답');
    });

    it('전체 건수가 숫자가 아니면 실패로 본다', async () => {
      const fake = new FakeFetch().on(any, { body: '<wantedList><totalCount>abc</totalCount><resultCode>0</resultCode></wantedList>' });
      await expect(national(fake).fetchAll()).rejects.toThrow('전체 건수를 읽을 수 없습니다');
    });

    it('servId가 비어 있는 항목이 있으면 실패로 본다', async () => {
      const fake = new FakeFetch().on(any, wanted(1, '<servList><servNm>ID 없음</servNm></servList>'));
      await expect(national(fake).fetchAll()).rejects.toThrow('ID가 없는 항목');
    });
  });
});
