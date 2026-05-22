import z from 'zod';

const id = z.string().uuid();
const userId = z.string().min(1);

export const postSchema = z.object({
	id,

	title: z
		.string()
		.trim()
		.min(1, 'Title is required')
		.max(120, 'Title must be at most 120 characters'),

	slug: z
		.string()
		.trim()
		.min(1, 'Slug is required')
		.max(140, 'Slug must be at most 140 characters')
		.regex(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			'Slug must be lowercase, alphanumeric, and hyphen-separated',
		),

	description: z
		.string()
		.trim()
		.min(1, 'Description is required')
		.max(300, 'Description must be at most 300 characters'),

	content: z.string().trim().min(1, 'Content is required'),

	heroImage: z.string().url('Hero image must be a valid URL').optional(),

	tags: z
		.array(z.string().trim().min(1).max(30))
		.max(10, 'A post can have at most 10 tags')
		.default([]),

	published: z.boolean().default(false),

	pubDate: z.coerce.date(),

	createdAt: z.coerce.date(),

	updatedAt: z.coerce.date().nullable(),

	author: z.object({
		id: userId,
		name: z.string().trim().min(1),
	}),
});

export type Post = z.infer<typeof postSchema>;
