import type { NextConfig } from 'next';
const config: NextConfig = {
  output: 'export',
  basePath: '/A.Zidan',
  trailingSlash: true,
  images: { unoptimized: true },
};
export default config;
