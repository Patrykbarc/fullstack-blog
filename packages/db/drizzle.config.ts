import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { getEnvs } from './src/constants/env.generated';

export default defineConfig({
	schema: './src/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: { url: getEnvs().DATABASE_URL },
	strict: true,
	verbose: true,
});
