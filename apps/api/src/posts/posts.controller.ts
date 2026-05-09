import { Controller, Get, Param, Query } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Get('/')
	getAllPosts() {
		return this.postsService.getAllPosts();
	}

	@Get('/search')
	getPostByTitle(@Query('title') title: string) {
		return this.postsService.getProductByTitle(title);
	}

	@Get('/:id')
	getPostById(@Param('id') id: string) {
		return this.postsService.getProductById(id);
	}
}
