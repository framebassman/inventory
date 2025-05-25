import { defineConfig, coverageConfigDefaults } from 'vitest/config';

export default defineConfig({
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
