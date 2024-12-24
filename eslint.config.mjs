import globals from 'globals';
import pluginJs from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';

export default [
  pluginJs.configs.recommended,
  {
    languageOptions: {
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      'no-empty': 'off',
      'no-redeclare': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    languageOptions: {
      globals: {
        BdApi: 'readonly',
        require: 'readonly',
        module: 'readonly',
      },
    },
  },
  stylistic.configs['recommended-flat'],
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/operator-linebreak': ['error', 'before', {
        overrides: {
          '=': 'after',
        },
      }],
      '@stylistic/space-unary-ops': [2, {
        words: false,
        nonwords: false,
        overrides: {
          new: true,
        },
      }],
      '@stylistic/indent-binary-ops': 'off',
    },
  },
];
