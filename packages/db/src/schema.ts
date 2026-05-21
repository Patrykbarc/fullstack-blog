import { sql } from 'drizzle-orm';
import { boolean, jsonb, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export type Author = { id: string; name: string };

export const posts = pgTable('posts', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: varchar('title', { length: 120 }).notNull(),
	slug: varchar('slug', { length: 140 }).notNull().unique(),
	description: varchar('description', { length: 300 }).notNull(),
	content: text('content').notNull(),
	heroImage: text('hero_image'),
	tags: text('tags')
		.array()
		.notNull()
		.default(sql`'{}'::text[]`),
	published: boolean('published').notNull().default(false),
	pubDate: timestamp('pub_date', { withTimezone: true, mode: 'date' }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }),
	author: jsonb('author').$type<Author>().notNull(),
});

export type PostRow = typeof posts.$inferSelect;
export type NewPostRow = typeof posts.$inferInsert;
