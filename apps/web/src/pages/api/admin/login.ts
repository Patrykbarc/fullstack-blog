import type { APIRoute } from 'astro';
import { ADMIN_COOKIE, ADMIN_COOKIE_OPTIONS } from '../../../lib/adminCookie';
import { authApi } from '../../../lib/api';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
	const body = (await request.json().catch(() => ({}))) as { apiKey?: unknown };
	const apiKey = typeof body.apiKey === 'string' ? body.apiKey.trim() : '';
	if (!apiKey) {
		return new Response(JSON.stringify({ error: 'apiKey is required' }), {
			status: 400,
			headers: { 'content-type': 'application/json' },
		});
	}

	const ok = await authApi.verify(apiKey);
	if (!ok) {
		return new Response(JSON.stringify({ error: 'invalid api key' }), {
			status: 401,
			headers: { 'content-type': 'application/json' },
		});
	}

	cookies.set(ADMIN_COOKIE, apiKey, ADMIN_COOKIE_OPTIONS);
	return new Response(JSON.stringify({ ok: true }), {
		status: 200,
		headers: { 'content-type': 'application/json' },
	});
};
