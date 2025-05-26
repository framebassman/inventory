import { defineConfig, coverageConfigDefaults } from 'vitest/config';
import { codecovVitePlugin } from "@codecov/vite-plugin";

export default defineConfig({
  plugins: [
    // Put the Codecov vite plugin after all other plugins
    codecovVitePlugin({
      enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined,
      bundleName: "inventory",
      uploadToken: process.env.CODECOV_TOKEN,
    }),
  ],
  test: {
    reporters: [
      'default',
      ['junit', { suiteName: 'UI tests', outputFile: 'junit.xml' }]
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: [
        'migrations/**',
        'ley.config.cjs',
        ...coverageConfigDefaults.exclude
      ]
    }
  }
});
