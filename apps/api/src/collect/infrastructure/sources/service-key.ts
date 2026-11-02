export class MissingServiceKeyError extends Error {
  constructor() {
    super('DATA_GO_KR_SERVICE_KEY가 설정되지 않았습니다. apps/api/.env에 공공데이터포털 일반 인증키(Decoding)를 넣어 주세요.');
  }
}

// 공공데이터포털 인증키. 계정당 하나라 모든 출처가 같은 키를 쓴다.
export class ServiceKey {
  private constructor(private readonly value: string) {}

  static fromEnv(env: NodeJS.ProcessEnv = process.env): ServiceKey | null {
    const value = env.DATA_GO_KR_SERVICE_KEY?.trim().replace(/^"|"$/g, '');
    return value ? new ServiceKey(value) : null;
  }

  static required(key: ServiceKey | null): ServiceKey {
    if (!key) throw new MissingServiceKeyError();
    return key;
  }

  signed(url: URL): URL {
    const copy = new URL(url);
    copy.searchParams.set('serviceKey', this.value);
    return copy;
  }
}
