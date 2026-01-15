import sharedConfig from '@repo/shared-ui/tailwind.config';
import type { Config } from 'tailwindcss';

export default {
  presets: [sharedConfig],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../../packages/shared-ui/src/**/*.{ts,tsx}',
    '../../packages/design-system/src/**/*.{ts,tsx}',
    '../../packages/feature/**/*.{ts,tsx}',
  ],
} satisfies Config;
