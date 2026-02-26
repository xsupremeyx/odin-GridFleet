import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import html from 'eslint-plugin-html';

export default [
  {
    ignores: ['node_modules/', 'dist/', 'build/'],
  },

  // Frontend (browser, ESM)
  {
    files: ['**/*.js', '**/*.html'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
      },
    },
    plugins: { html },
    rules: {
      ...js.configs.recommended.rules,
      ...prettier.rules,
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },

  // Webpack configs (Node, CommonJS)
  {
    files: ['webpack.*.js', '*.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
  },
];
