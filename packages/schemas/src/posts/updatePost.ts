import z from 'zod';
import { postSchema } from './post';

export const updatePostSchema = postSchema
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		author: true,
	})
	.partial();

export type UpdatePost = z.infer<typeof updatePostSchema>;
