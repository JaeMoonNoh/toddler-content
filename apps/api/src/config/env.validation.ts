import { plainToInstance, Transform } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsString, IsUrl, Max, Min, validateSync } from 'class-validator';

const DEFAULT_PORT = 4000;
const DEFAULT_WEB_ORIGIN = 'http://localhost:3000';
const MAX_PORT = 65_535;

// NOTE: .env에 따옴표째 넣는 경우가 많아서 앞뒤 공백과 따옴표를 벗긴다
const unquote = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim().replace(/^"|"$/g, '') : value);

// 서버와 CLI가 시작할 때 한 번 검증한다. 필수 값이 없으면 시작하지 않는다. 비밀 값에는 기본값을 두지 않는다
export class EnvironmentVariables {
  @Transform(unquote)
  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  // 공공데이터포털 일반 인증키(Decoding). 출처 세 곳이 같은 키를 쓴다
  @Transform(unquote)
  @IsString()
  @IsNotEmpty()
  DATA_GO_KR_SERVICE_KEY!: string;

  @Transform(({ value }) => (value === undefined ? DEFAULT_PORT : Number(value)))
  @IsInt()
  @Min(1)
  @Max(MAX_PORT)
  PORT: number = DEFAULT_PORT;

  @IsUrl({ require_tld: false, require_protocol: true })
  WEB_ORIGIN: string = DEFAULT_WEB_ORIGIN;

  // off면 새벽 자동 수집을 끈다
  @IsIn(['on', 'off'])
  COLLECT_SCHEDULE: 'on' | 'off' = 'on';
}

export function validateEnv(config: Record<string, unknown>): EnvironmentVariables {
  const env = plainToInstance(EnvironmentVariables, config);
  const errors = validateSync(env, { skipMissingProperties: false });
  if (errors.length > 0) {
    const problems = errors.map((error) => `${error.property}: ${Object.values(error.constraints ?? {}).join(', ')}`);
    throw new Error(`환경 변수가 올바르지 않습니다. apps/api/.env를 확인해 주세요.\n- ${problems.join('\n- ')}`);
  }
  return env;
}
