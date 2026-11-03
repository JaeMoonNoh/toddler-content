// @ts-check
import eslint from '@eslint/js';
import eslintPluginPerfectionist from 'eslint-plugin-perfectionist';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'src/generated/**', '*.config.{mjs,js,ts}', '.lintstagedrc.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: globals.node,
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { perfectionist: eslintPluginPerfectionist },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // interface·type 이름에 I/T 접두사를 붙이지 않는다 (CLAUDE.md NestJS 규칙)
      '@typescript-eslint/naming-convention': [
        'error',
        {
          format: ['camelCase', 'UPPER_CASE', 'snake_case', 'PascalCase'],
          selector: 'variable',
          leadingUnderscore: 'allow',
        },
        { format: ['camelCase', 'PascalCase'], selector: 'function' },
      ],

      /** 정렬 규칙: https://perfectionist.dev/ */
      'perfectionist/sort-exports': 'error',
      'perfectionist/sort-named-exports': 'error',
      'perfectionist/sort-named-imports': 'error',
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          groups: [
            ['side-effect'],
            ['builtin'],
            ['nest'],
            ['external'],
            ['parent'],
            ['sibling'],
            ['index'],
            ['type-builtin'],
            ['type-external'],
            ['type-parent'],
            ['type-sibling'],
            ['type-index'],
            ['unknown'],
          ],
          customGroups: [{ groupName: 'nest', elementNamePattern: ['^@nestjs/.*'] }],
        },
      ],
      'perfectionist/sort-object-types': 'off',
      'perfectionist/sort-objects': 'off',
    },
  },
  {
    // 가짜 구현은 async 포트를 메모리로 구현하므로 await가 없다. expect.stringContaining 등은 any를 돌려준다
    files: ['src/**/test/**/*.ts'],
    rules: {
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
  {
    // CLI는 결과를 console로 출력한다 (CLAUDE.md NestJS 규칙)
    files: ['src/**/*.cli.ts'],
    rules: { 'no-console': 'off' },
  },
);
