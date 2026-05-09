import { Injectable, NotFoundException } from '@nestjs/common';

const TODAY = new Date(Date.now());
const YESTERDAY = new Date(Date.now() - 24 * 60 * 60 * 1000);

@Injectable()
export class PostsService {
	private posts = [
		{
			id: 1,
			title: 'First post',
			createdAt: YESTERDAY,
			updatedAt: null,
		},
		{
			id: 2,
			title: 'Second post',
			createdAt: TODAY,
			updatedAt: null,
		},
	];

	getAllPosts() {
		return this.posts;
	}

	getProductById(id: string) {
		const post = this.posts.find((post) => post.id === +id);
		if (!post) {
			throw new NotFoundException('Post not found');
		}

		return post;
	}

	getProductByTitle(title: string) {
		const post = this.posts.find(
			(post) => post.title.toLocaleLowerCase() === title.toLocaleLowerCase(),
		);
		if (!post) {
			throw new NotFoundException('Post not found');
		}

		return post;
	}
}
