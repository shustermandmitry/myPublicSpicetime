import type { JestConfigWithTsJest } from 'ts-jest';

process.env.TZ = 'GMT';

const jestConfig: JestConfigWithTsJest = {
  extensionsToTreatAsEsm: ['.ts'],
  preset: 'ts-jest/presets/js-with-ts-esm',
  globals: {},
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
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
          noImplicitAny: false,
          strict: false,
          suppressImplicitAnyIndexErrors: true,
        },
      },
    ],
  },
};

export default jestConfig;
