/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['import'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['dist/**/*'],
  rules: {
    // TODO: fix those rules
    'react/prop-types': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-object-type': 'warn',
    'react/react-in-jsx-scope': 'off',
    'import/no-relative-packages': 'error',
    'react/display-name': 'off',
    'jsx-a11y/anchor-has-content': 'off',
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        groups: ['internal', ['external', 'builtin'], ['parent', 'sibling', 'index']],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
          },
        ],
      },
    ],
  },
};
