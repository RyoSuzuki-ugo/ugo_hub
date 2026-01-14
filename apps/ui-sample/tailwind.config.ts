import type { Config } from 'tailwindcss';
import sharedConfig from '@repo/shared-ui/tailwind.config';

export default {
  ...sharedConfig,
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/shared-ui/src/**/*.{js,ts,jsx,tsx}',
  ],
} satisfies Config;
