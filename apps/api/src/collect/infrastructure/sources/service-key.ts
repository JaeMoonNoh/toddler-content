// 공공데이터포털 인증키. 계정당 하나라 모든 출처가 같은 키를 쓴다. 값은 시작할 때 env.validation이 검증한다
export class ServiceKey {
  constructor(private readonly value: string) {}

  signed(url: URL): URL {
    const copy = new URL(url);
    copy.searchParams.set('serviceKey', this.value);
    return copy;
  }
}
