import 'dotenv/config';
import { createDb } from './client';
import { posts } from './schema';
import { getEnvs } from './constants/env.generated';

const AUTHOR = { id: 'fb037077-5289-4149-a68f-1fa7af3e3c2e', name: 'Patryk' };

async function main() {
	const { DATABASE_URL } = getEnvs();

	const { db, client } = createDb(DATABASE_URL, { max: 1 });

	const now = new Date();
	const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

	await db
		.insert(posts)
		.values([
			{
				title: 'First post',
				slug: 'first-post',
				description: 'Short description of the first post.',
				content: 'Content of the first post.',
				tags: [],
				published: true,
				pubDate: yesterday,
				author: AUTHOR,
			},
			{
				title: 'Second post',
				slug: 'second-post',
				description: 'Short description of the second post.',
				content: 'Content of the second post.',
				tags: [],
				published: true,
				pubDate: now,
				author: AUTHOR,
			},
		])
		.onConflictDoNothing({ target: posts.slug });

	await client.end();
	console.log('seed complete');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
