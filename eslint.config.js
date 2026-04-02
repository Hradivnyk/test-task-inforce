import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import nodePlugin from 'eslint-plugin-node';
import securityPlugin from 'eslint-plugin-security';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
  js.configs.recommended,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
      node: nodePlugin,
      security: securityPlugin,
      import: importPlugin,
    },

    languageOptions: {
      ecmaVersion: 2025,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },

    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: 'next' }],
      'no-console': 'warn',
      'no-var': 'error',
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always'],
      'no-throw-literal': 'error',
      'no-async-promise-executor': 'error',
      'no-await-in-loop': 'warn',
      'require-await': 'error',
      'node/no-deprecated-api': 'error',
      'node/no-missing-import': 'error',
      'node/no-extraneous-dependencies': 'error',
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-eval-with-expression': 'error',
      'import/no-duplicates': 'error',
      'import/first': 'error',
      'import/no-cycle': 'warn',
    },
  },
  {
    files: ['tests/**/*.js', '**/*.test.js'],
    rules: {
      'no-console': 'off',
      'node/no-missing-import': 'off',
      'security/detect-object-injection': 'off',
    },
  },
];