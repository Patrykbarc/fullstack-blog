import { Injectable, NotFoundException } from '@nestjs/common';
import type { Post } from '@monorepo/schemas';
import { CreatePostDto } from './dto/createPost.dto';
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

const TODAY = new Date(Date.now());
const YESTERDAY = new Date(Date.now() - 24 * 60 * 60 * 1000);

@Injectable()
export class PostsService {
	private readonly authorId = 'fb037077-5289-4149-a68f-1fa7af3e3c2e';
	private readonly authorName = 'Patryk';

	private posts: Post[] = [
		{
			id: uuidv4(),
			title: 'First post',
			slug: 'first-post',
			description: 'Short description of the first post.',
			content: 'Content of the first post.',
			tags: [],
			published: true,
			pubDate: YESTERDAY,
			createdAt: YESTERDAY,
			updatedAt: null,
			author: { id: this.authorId, name: this.authorName },
		},
		{
			id: uuidv4(),
			title: 'Second post',
			slug: 'second-post',
			description: 'Short description of the second post.',
			content: 'Content of the second post.',
			tags: [],
			published: true,
			pubDate: TODAY,
			createdAt: TODAY,
			updatedAt: null,
			author: { id: this.authorId, name: this.authorName },
		},
	];

	getAllPosts() {
		return this.posts;
	}

	getPostById(id: string) {
		const post = this.posts.find((post) => post.id === id);
		if (!post) {
			throw new NotFoundException('Post not found');
		}

		return post;
	}

	getPostByTitle(title: string) {
		const post = this.posts.find(
			(post) => post.title.toLocaleLowerCase() === title.toLocaleLowerCase(),
		);
		if (!post) {
			throw new NotFoundException('Post not found');
		}

		return post;
	}

	createPost(dto: CreatePostDto): Post {
		const now = new Date();
		const newPost: Post = {
			id: uuidv4(),
			slug: dto.slug ?? slugify(dto.title).toLocaleLowerCase(),
			pubDate: dto.pubDate ?? now,
			createdAt: now,
			updatedAt: null,
			author: { id: this.authorId, name: this.authorName },
			...dto,
		};

		this.posts.push(newPost);

		return newPost;
	}
}
