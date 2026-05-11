import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Get('/')
	getAllPosts() {
		return this.postsService.getAllPosts();
	}

	@Get('/search')
	getPostByTitle(@Query('title') title: string) {
		return this.postsService.getPostByTitle(title);
	}

	@Get('/:id')
	getPostById(@Param('id') id: string) {
		return this.postsService.getPostById(id);
	}

	@Post()
	createPost(@Body() post: CreatePostDto) {
		return this.postsService.createPost(post);
	}
}
