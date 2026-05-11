import { defineConfig } from 'tsdown';

export default defineConfig((cliOptions) => ({
	entry: ['src/index.ts'],
	format: ['esm', 'cjs'],
	dts: true,
	clean: !cliOptions.watch,
	sourcemap: true,
}));
