import baseConfig from '@monorepo/prettier-config';

/** @type {import('prettier').Config} */
export default {
	...baseConfig,
	plugins: ['prettier-plugin-astro'],
	overrides: [{ files: '*.astro', options: { parser: 'astro' } }],
};
