import type { APIRoute } from 'astro';
import { updatePostSchema } from '@monorepo/schemas';
import { ADMIN_COOKIE } from '../../../lib/adminCookie';
import { ApiError, postsApi } from '../../../lib/api';

export const prerender = false;

function unauthorized() {
	return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
}

function asApiError(err: unknown) {
	if (err instanceof ApiError) {
		return new Response(JSON.stringify({ error: err.message, body: err.body }), {
			status: err.status,
			headers: { 'content-type': 'application/json' },
		});
	}
	throw err;
}

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
	const apiKey = cookies.get(ADMIN_COOKIE)?.value;
	if (!apiKey) return unauthorized();

	const id = params.id;
	if (!id) return new Response('id required', { status: 400 });

	const json: unknown = await request.json().catch(() => ({}));
	const parsed = updatePostSchema.safeParse(json);
	if (!parsed.success) {
		return new Response(
			JSON.stringify({ error: 'invalid body', details: parsed.error.flatten() }),
			{ status: 400, headers: { 'content-type': 'application/json' } },
		);
	}

	try {
		const updated = await postsApi.update(id, parsed.data, apiKey);
		return new Response(JSON.stringify(updated), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	} catch (err) {
		return asApiError(err);
	}
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
	const apiKey = cookies.get(ADMIN_COOKIE)?.value;
	if (!apiKey) return unauthorized();

	const id = params.id;
	if (!id) return new Response('id required', { status: 400 });

	try {
		await postsApi.delete(id, apiKey);
		return new Response(null, { status: 204 });
	} catch (err) {
		return asApiError(err);
	}
};
