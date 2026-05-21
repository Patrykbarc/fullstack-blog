// @ts-check
import baseConfig, { defineConfig, globals, tseslint } from '@monorepo/eslint-config';

export default defineConfig(
	{
		ignores: ['eslint.config.mjs', '.prettierrc.mjs', 'dist/**', 'src/constants/env.generated.ts'],
	},
	...baseConfig,
	...tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			globals: {
				...globals.node,
				...globals.jest,
			},
			sourceType: 'commonjs',
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-floating-promises': 'warn',
			'@typescript-eslint/no-unsafe-argument': 'warn',
		},
	},
	{
		files: ['**/*.spec.ts', '**/*.e2e-spec.ts', 'test/**/*.ts'],
		...tseslint.configs.disableTypeChecked,
	},
);
