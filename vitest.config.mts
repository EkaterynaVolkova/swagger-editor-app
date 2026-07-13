import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [react()],
  test: {
    css: false,
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setup-tests.tsx',
    coverage: {
      reporter: 'text',
      provider: 'v8',
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'src/**/*.test.{js,jsx,ts,tsx}',
        'src/**/*.spec.{js,jsx,ts,tsx}',
        'src/setup-tests.{js,ts,tsx}',
        'src/i18n/**/*',
        'src/**/*.d.ts',
        'src/middleware.ts',
        'src/constants/**',
        'src/app/[locale]/layout.tsx',
        'src/lib/firebase/admin.ts',
      ],
      thresholds: {
        global: {
          statements: 80,
          branches: 50,
          functions: 50,
          lines: 50,
        },
      },
    },
  },
});
