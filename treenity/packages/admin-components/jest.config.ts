// jest.config.ts
import type { JestConfigWithTsJest } from 'ts-jest';

process.env.TZ = 'GMT';

const jestConfig: JestConfigWithTsJest = {
  extensionsToTreatAsEsm: ['.ts'],
  preset: 'ts-jest/presets/js-with-ts-esm',
  globals: {},
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/src/__mocks__/styleMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/app/$1',
  },
  snapshotSerializers: ['@emotion/jest/serializer'],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['node_modules/.pnpm/(?!(@web3-storage|@s-libs))'],
  transform: {
    '^.+\\.(ts|js|jsx|mjs|tsx)?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          allowJs: true,
          esModuleInterop: true,
        },
      },
    ],
  },
};

export default jestConfig;
