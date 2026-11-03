import { relative } from 'path';

const toRelative = (filenames) => filenames.map((f) => relative(process.cwd(), f)).join(' ');

const buildEslintCommand = (filenames) => `eslint --fix --format codeframe ${toRelative(filenames)}`;

// tsc-files는 pnpm에서 타입 체크를 조용히 건너뛰므로 프로젝트 전체를 검사한다. 파일 목록은 넘기지 않는다
const buildTscCommand = () => 'tsc --noEmit -p tsconfig.json';

export default {
  'src/**/*.ts': [buildEslintCommand, buildTscCommand],
};
