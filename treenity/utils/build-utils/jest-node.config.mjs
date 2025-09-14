import path from 'node:path';

export default () => ({
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  modulePathIgnorePatterns: ['<rootDir>/libs'],
  transformIgnorePatterns: ['node_modules/.pnpm/(?!.*.mjs$)'],
  transform: {
    '^.+\\.(ts|js|jsx|mjs|tsx)$': [
      'ts-jest',
      {
        allowJs: true,
        useESM: true,
        diagnostics: {
          // import.meta errors ignore
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: import.meta.dirname + '/node_modules/ts-jest-mock-import-meta',
              options: mockImportOptions,
            },
          ],
        },
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
});

const mockImportOptions = {
  metaObjectReplacement: {
    url: p => 'file://' + p.fileName,
    dirname: p => path.dirname(p.fileName),
    filename: p => p.fileName,
  },
};
