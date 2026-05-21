import 'dotenv/config';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { createDb } from './client';
import { getEnvs } from './constants/env.generated';

async function main() {
	const { DATABASE_URL } = getEnvs();

	const { db, client } = createDb(DATABASE_URL, { max: 1 });
	await migrate(db, { migrationsFolder: './drizzle' });
	await client.end();
	console.log('migrations applied');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
