import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import jestPlugin from 'eslint-plugin-jest';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default [
  js.configs.recommended,
  prettier,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.browser, ...globals.jest, ...globals.node },
      sourceType: 'module',
    },
    plugins: { '@stylistic': stylistic, jest: jestPlugin },
    rules: {
      '@stylistic/eol-last': ['error', 'always'],
      eqeqeq: 'error',
      'jest/unbound-method': 'off',
      'no-console': 'off',
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'prettier/prettier': 'error',
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        },
      ],
      'unbound-method': 'off',
    },
  },
  { ignores: ['node_modules/'] },
];
