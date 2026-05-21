import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { Post } from '@monorepo/schemas';
import { posts, type PostRow, type Db } from '@monorepo/db';
import { eq, ilike } from 'drizzle-orm';
import slugify from 'slugify';
import { DB } from '../db/db.module';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';

@Injectable()
export class PostsService {
	private readonly authorId = 'fb037077-5289-4149-a68f-1fa7af3e3c2e';
	private readonly authorName = 'Patryk';

	constructor(@Inject(DB) private readonly db: Db) {}

	async getAllPosts(): Promise<Post[]> {
		const rows = await this.db.select().from(posts);
		return rows.map(toPost);
	}

	async getPostById(id: string): Promise<Post> {
		const [row] = await this.db.select().from(posts).where(eq(posts.id, id)).limit(1);
		if (!row) {
			throw new NotFoundException('Post not found');
		}
		return toPost(row);
	}

	async getPostByTitle(title: string): Promise<Post> {
		const [row] = await this.db.select().from(posts).where(ilike(posts.title, title)).limit(1);
		if (!row) {
			throw new NotFoundException('Post not found');
		}
		return toPost(row);
	}

	async getPostBySlug(slug: string): Promise<Post> {
		const [row] = await this.db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
		if (!row) {
			throw new NotFoundException('Post not found');
		}
		return toPost(row);
	}

	async createPost(dto: CreatePostDto): Promise<Post> {
		const slug = dto.slug ?? slugify(dto.title).toLocaleLowerCase();
		const [row] = await this.db
			.insert(posts)
			.values({
				title: dto.title,
				slug,
				description: dto.description,
				content: dto.content,
				heroImage: dto.heroImage,
				tags: dto.tags ?? [],
				published: dto.published ?? false,
				pubDate: dto.pubDate ?? new Date(),
				author: { id: this.authorId, name: this.authorName },
			})
			.returning();
		return toPost(row);
	}

	async updatePost(id: Post['id'], dto: UpdatePostDto): Promise<Post> {
		const slug = dto.title && !dto.slug ? slugify(dto.title).toLocaleLowerCase() : dto.slug;

		const [row] = await this.db
			.update(posts)
			.set({
				...dto,
				...(slug !== undefined && { slug }),
				updatedAt: new Date(),
			})
			.where(eq(posts.id, id))
			.returning();

		if (!row) {
			throw new NotFoundException('Post not found');
		}
		return toPost(row);
	}

	async deletePost(id: Post['id']): Promise<void> {
		const result = await this.db.delete(posts).where(eq(posts.id, id)).returning({ id: posts.id });
		if (result.length === 0) {
			throw new NotFoundException('Post not found');
		}
	}
}

function toPost(row: PostRow): Post {
	return {
		id: row.id,
		title: row.title,
		slug: row.slug,
		description: row.description,
		content: row.content,
		heroImage: row.heroImage ?? undefined,
		tags: row.tags,
		published: row.published,
		pubDate: row.pubDate,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt,
		author: row.author,
	};
}
