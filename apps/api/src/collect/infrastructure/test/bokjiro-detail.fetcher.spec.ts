import { describe, expect, it } from 'vitest';

import { HttpClient } from '../../../shared/infrastructure/http-client';
import { ServiceKey } from '../../../shared/infrastructure/service-key';
import { FakeFetch } from '../../../shared/infrastructure/test/fakes/fake-fetch';
import { BokjiroLocalDetailFetcher, BokjiroNationalDetailFetcher } from '../sources/bokjiro/bokjiro-detail.fetcher';

const key = new ServiceKey('TEST-KEY');
const any = () => true;
const dtl = (...fields: string[]) => ({
  body: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><wantedDtl><resultCode>0</resultCode><resultMessage>SUCCESS</resultMessage>${fields.join('')}</wantedDtl>`,
});
const contact = (phone: string) =>
  `<inqplCtadrList><wlfareInfoDtlCd>010</wlfareInfoDtlCd><wlfareInfoReldCn>${phone}</wlfareInfoReldCn></inqplCtadrList>`;

const local = (fake: FakeFetch) => new BokjiroLocalDetailFetcher(new HttpClient(fake.fetch, { retries: 0 }), key);
const national = (fake: FakeFetch) => new BokjiroNationalDetailFetcher(new HttpClient(fake.fetch, { retries: 0 }), key);

describe('복지로 상세 fetcher', () => {
  describe('지자체', () => {
    it('servId와 servNm으로 원본을 만들고, 받은 필드를 그대로 담는다', async () => {
      const fake = new FakeFetch().on(
        any,
        dtl('<servId>WLF00003156</servId><servNm>발달장애아동 지원</servNm><sprtTrgtCn>18세 미만</sprtTrgtCn><inqNum>0012</inqNum>'),
      );

      expect(await local(fake).fetchDetail('WLF00003156')).toEqual({
        externalId: 'WLF00003156',
        name: '발달장애아동 지원',
        payload: {
          resultCode: '0',
          resultMessage: 'SUCCESS',
          servId: 'WLF00003156',
          servNm: '발달장애아동 지원',
          sprtTrgtCn: '18세 미만',
          inqNum: '0012',
        },
      });
    });

    it('지자체 상세 주소에 servId를 붙여 요청한다', async () => {
      const fake = new FakeFetch().on(any, dtl('<servId>A</servId>'));
      await local(fake).fetchDetail('A');

      const [request] = fake.requests;
      expect(request.pathname).toMatch(/LcgvWelfaredetailed$/);
      expect(request.searchParams.get('servId')).toBe('A');
      expect(request.searchParams.get('serviceKey')).toBe('TEST-KEY');
    });

    it('목록 필드가 1건뿐이어도 배열로 읽는다', async () => {
      const fake = new FakeFetch().on(any, dtl('<servId>A</servId>', contact('033-111-1111')));
      expect((await local(fake).fetchDetail('A')).payload.inqplCtadrList).toEqual([
        { wlfareInfoDtlCd: '010', wlfareInfoReldCn: '033-111-1111' },
      ]);
    });

    it('목록 필드가 여러 건이면 순서대로 배열로 읽는다', async () => {
      const fake = new FakeFetch().on(any, dtl('<servId>A</servId>', contact('1'), contact('2')));
      const list = (await local(fake).fetchDetail('A')).payload.inqplCtadrList as { wlfareInfoReldCn: string }[];
      expect(list.map((c) => c.wlfareInfoReldCn)).toEqual(['1', '2']);
    });

    it('List로 끝나도 목록 안쪽 필드는 배열로 바꾸지 않는다', async () => {
      const fake = new FakeFetch().on(any, dtl('<servId>A</servId>', '<basfrmList><nameList>서식</nameList></basfrmList>'));
      expect((await local(fake).fetchDetail('A')).payload.basfrmList).toEqual([{ nameList: '서식' }]);
    });

    it('&#13;는 글자 그대로 두고 &amp;는 원래 글자로 바꾼다', async () => {
      const fake = new FakeFetch().on(any, dtl('<servId>A</servId><sprtTrgtCn>첫째&#13;둘째</sprtTrgtCn><x>a&amp;b</x>'));
      expect((await local(fake).fetchDetail('A')).payload).toMatchObject({ sprtTrgtCn: '첫째&#13;둘째', x: 'a&b' });
    });
  });

  describe('중앙부처', () => {
    it('상세 조회 고정 파라미터를 붙여 요청하고 본문을 읽는다', async () => {
      const fake = new FakeFetch().on(
        any,
        dtl('<servId>WLF00003242</servId><servNm>국가예방접종</servNm><tgtrDtlCn>12세 이하</tgtrDtlCn>'),
      );

      const record = await national(fake).fetchDetail('WLF00003242');

      expect(record).toMatchObject({ name: '국가예방접종', payload: { tgtrDtlCn: '12세 이하' } });
      const [request] = fake.requests;
      expect(request.pathname).toMatch(/NationalWelfaredetailedV001$/);
      expect(Object.fromEntries(request.searchParams)).toMatchObject({ servId: 'WLF00003242', callTp: 'D' });
    });

    it('신청 방법 목록도 1건이면 배열로 읽는다', async () => {
      const fake = new FakeFetch().on(any, dtl('<servId>A</servId><applmetList><servSeCode>070</servSeCode></applmetList>'));
      expect((await national(fake).fetchDetail('A')).payload.applmetList).toEqual([{ servSeCode: '070' }]);
    });
  });

  describe('오류 응답', () => {
    it('게이트웨이 오류는 HTTP 200이어도 실패로 본다', async () => {
      const fake = new FakeFetch().on(any, {
        body: '<OpenAPI_ServiceResponse><cmmMsgHeader><errMsg>SERVICE ERROR</errMsg><returnAuthMsg>SERVICE_KEY_IS_NOT_REGISTERED_ERROR</returnAuthMsg><returnReasonCode>30</returnReasonCode></cmmMsgHeader></OpenAPI_ServiceResponse>',
      });
      await expect(local(fake).fetchDetail('A')).rejects.toThrow('BOKJIRO_LOCAL: SERVICE_KEY_IS_NOT_REGISTERED_ERROR (코드 30)');
    });

    it('없는 servId처럼 resultCode가 0이 아니면 실패로 본다', async () => {
      const fake = new FakeFetch().on(any, {
        body: '<wantedDtl><resultCode>10</resultCode><resultMessage>INVALID_REQUEST_PARAMETER_ERROR</resultMessage></wantedDtl>',
      });
      await expect(national(fake).fetchDetail('A')).rejects.toThrow('BOKJIRO_NATIONAL: INVALID_REQUEST_PARAMETER_ERROR (코드 10)');
    });

    it('XML이 아니면 실패로 본다', async () => {
      const fake = new FakeFetch().on(any, { body: 'Unexpected errors' });
      await expect(local(fake).fetchDetail('A')).rejects.toThrow('XML이 아닌 응답');
    });

    it('목록 응답처럼 모르는 XML 모양이면 실패로 본다', async () => {
      const fake = new FakeFetch().on(any, { body: '<wantedList><totalCount>0</totalCount></wantedList>' });
      await expect(local(fake).fetchDetail('A')).rejects.toThrow('예상과 다른 응답');
    });

    it('요청한 것과 다른 항목이 오면 실패로 본다', async () => {
      const fake = new FakeFetch().on(any, dtl('<servId>B</servId>'));
      await expect(local(fake).fetchDetail('A')).rejects.toThrow('A를 요청했는데 다른 항목이 왔습니다 (B)');
    });

    it('servId가 없으면 실패로 본다', async () => {
      const fake = new FakeFetch().on(any, dtl('<servNm>이름만</servNm>'));
      await expect(local(fake).fetchDetail('A')).rejects.toThrow('다른 항목이 왔습니다 (없음)');
    });
  });
});
