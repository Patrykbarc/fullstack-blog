import { postSchema, type CreatePost, type Post, type UpdatePost } from '@monorepo/schemas';
import { z } from 'zod';
import { apiClient } from '../lib/apiClient';

const postsListSchema = z.array(postSchema);

export async function getPosts(): Promise<Post[]> {
	const res = await apiClient.get('/posts');
	return postsListSchema.parse(res.data);
}

export async function getPost(id: string): Promise<Post> {
	const res = await apiClient.get(`/posts/${id}`);
	return postSchema.parse(res.data);
}

export async function getPostBySlug(slug: string): Promise<Post> {
	const res = await apiClient.get(`/posts/slug/${slug}`);
	return postSchema.parse(res.data);
}

export async function createPost(body: CreatePost): Promise<Post> {
	const res = await apiClient.post('/posts', body);
	return postSchema.parse(res.data);
}

export async function updatePost(id: string, body: UpdatePost): Promise<Post> {
	const res = await apiClient.patch(`/posts/${id}`, body);
	return postSchema.parse(res.data);
}

export async function deletePost(id: string): Promise<void> {
	await apiClient.delete(`/posts/${id}`);
}
