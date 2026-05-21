import type { APIRoute } from 'astro';
import { createPostSchema } from '@monorepo/schemas';
import { ADMIN_COOKIE } from '../../../lib/adminCookie';
import { ApiError, postsApi } from '../../../lib/api';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
	const apiKey = cookies.get(ADMIN_COOKIE)?.value;
	if (!apiKey) {
		return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
	}

	const json: unknown = await request.json().catch(() => ({}));
	const parsed = createPostSchema.safeParse(json);
	if (!parsed.success) {
		return new Response(
			JSON.stringify({ error: 'invalid body', details: parsed.error.flatten() }),
			{
				status: 400,
				headers: { 'content-type': 'application/json' },
			},
		);
	}

	try {
		const created = await postsApi.create(parsed.data, apiKey);
		return new Response(JSON.stringify(created), {
			status: 201,
			headers: { 'content-type': 'application/json' },
		});
	} catch (err) {
		if (err instanceof ApiError) {
			return new Response(JSON.stringify({ error: err.message, body: err.body }), {
				status: err.status,
				headers: { 'content-type': 'application/json' },
			});
		}
		throw err;
	}
};
