import z from 'zod';
import { postSchema } from './post';

export const createPostSchema = postSchema
	.omit({
		id: true,
		createdAt: true,
		updatedAt: true,
		author: true,
	})
	.extend({
		slug: postSchema.shape.slug.optional(),
		pubDate: postSchema.shape.pubDate.optional(),
	});

export type CreatePost = z.infer<typeof createPostSchema>;
