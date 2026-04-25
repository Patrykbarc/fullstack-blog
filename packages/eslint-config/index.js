import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		ignores: ['**/dist/**', '**/node_modules/**', '**/.astro/**', '**/build/**'],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.node,
				...globals.browser,
			},
		},
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
			],
			'no-console': ['warn', { allow: ['warn', 'error'] }],
		},
	},
	prettier,
];
