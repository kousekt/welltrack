import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/__tests__'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFiles: ['<rootDir>/src/__tests__/setup.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { diagnostics: false }],
  },
  moduleNameMapper: {
    '^node:crypto$': '<rootDir>/src/__mocks__/node-crypto.js',
  },
};

export default config;
