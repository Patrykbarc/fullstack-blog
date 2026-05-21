import type { Post, CreatePost, UpdatePost } from '@monorepo/schemas';
import { postSchema } from '@monorepo/schemas';
import { z } from 'zod';

const postsListSchema = z.array(postSchema);

export class ApiError extends Error {
	constructor(
		public readonly status: number,
		public readonly body: unknown,
	) {
		super(`API request failed with status ${status}`);
		this.name = 'ApiError';
	}
}

export function getApiBaseUrl(): string {
	const url = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:3000';
	return url.replace(/\/$/, '');
}

type FetchInit = RequestInit & { apiKey?: string };

async function request<T>(path: string, init: FetchInit, parser: (data: unknown) => T): Promise<T> {
	const headers = new Headers(init.headers);
	headers.set('accept', 'application/json');
	if (init.body !== undefined && !headers.has('content-type')) {
		headers.set('content-type', 'application/json');
	}
	if (init.apiKey) {
		headers.set('x-api-key', init.apiKey);
	}

	const res = await fetch(`${getApiBaseUrl()}${path}`, { ...init, headers });
	if (!res.ok) {
		const body = await res.text().catch(() => '');
		throw new ApiError(res.status, body);
	}
	if (res.status === 204) {
		return parser(undefined);
	}
	const json: unknown = await res.json();
	return parser(json);
}

export const postsApi = {
	list(init?: FetchInit): Promise<Post[]> {
		return request('/posts', { ...init, method: 'GET' }, (data) => postsListSchema.parse(data));
	},
	getById(id: string, init?: FetchInit): Promise<Post> {
		return request(`/posts/${id}`, { ...init, method: 'GET' }, (data) => postSchema.parse(data));
	},
	getBySlug(slug: string, init?: FetchInit): Promise<Post> {
		return request(`/posts/slug/${slug}`, { ...init, method: 'GET' }, (data) =>
			postSchema.parse(data),
		);
	},
	create(body: CreatePost, apiKey: string): Promise<Post> {
		return request('/posts', { method: 'POST', apiKey, body: JSON.stringify(body) }, (data) =>
			postSchema.parse(data),
		);
	},
	update(id: string, body: UpdatePost, apiKey: string): Promise<Post> {
		return request(
			`/posts/${id}`,
			{ method: 'PATCH', apiKey, body: JSON.stringify(body) },
			(data) => postSchema.parse(data),
		);
	},
	delete(id: string, apiKey: string): Promise<void> {
		return request(`/posts/${id}`, { method: 'DELETE', apiKey }, () => undefined);
	},
};

export const authApi = {
	async verify(apiKey: string): Promise<boolean> {
		try {
			await request('/auth/verify', { method: 'GET', apiKey }, () => undefined);
			return true;
		} catch (err) {
			if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
				return false;
			}
			throw err;
		}
	},
};
