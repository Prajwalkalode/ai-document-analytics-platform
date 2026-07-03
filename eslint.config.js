export default [
  {
    ignores: ['node_modules/**', 'coverage/**', 'dist/**', '.serverless/**', '.terraform/**'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      globals: {
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],
      'no-undef': 'error',
      'prefer-const': ['warn', { destructuring: 'all' }],
      'no-var': 'error',
      'no-empty-function': 'warn',
      'no-duplicate-imports': 'error',
    },
  },
];
