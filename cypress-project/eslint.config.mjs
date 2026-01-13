import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import cypress from 'eslint-plugin-cypress/flat';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  cypress.configs.recommended,
  {
    ignores: [
      '../**',
      'node_modules/**',
      'cypress/videos/**',
      'cypress/screenshots/**',
      'cypress/downloads/**',
      'allure-results/**',
      'allure-report/**',
      'dist/**',
      'build/**',
      'coverage/**',
    ],
  },
  {
    files: ['cypress/**/*.ts', '*.ts'],
    ignores: ['../tests/**', '../playwright.config.ts', '../eslint.config.mjs'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-console': 'off',
      'max-lines-per-function': ['warn', { max: 150, skipBlankLines: true, skipComments: true }],
      complexity: ['warn', 20],
    },
  },
  {
    files: ['cypress/support/po/**/*.ts', 'cypress/support/components/**/*.ts'],
    rules: {
      complexity: 'off',
    },
  },
  {
    files: ['cypress/e2e/**/*.cy.ts'],
    rules: {
      'cypress/no-assigning-return-values': 'error',
      'cypress/no-unnecessary-waiting': 'warn',
      'cypress/assertion-before-screenshot': 'warn',
      'cypress/no-force': 'warn',
      'cypress/no-async-tests': 'error',
      'no-magic-numbers': 'off',
    },
  },
];