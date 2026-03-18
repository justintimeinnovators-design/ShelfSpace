const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['<rootDir>/src/**/*.{test,spec}.{ts,tsx}'],
  testPathIgnorePatterns: ['<rootDir>/src/components/'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/utils/cn.ts',
    'src/utils/colorContrast.ts',
    'src/utils/stateValidation.ts',
    'src/lib/book-slug.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
