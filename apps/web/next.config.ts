import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Docker 이미지에 필요한 파일만 담기 위한 설정. 모노레포라 루트 기준으로 추적한다.
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
};

export default nextConfig;
