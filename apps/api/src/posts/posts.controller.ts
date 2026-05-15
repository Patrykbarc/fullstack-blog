import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { Post as PostSchema } from '@monorepo/schemas';

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Get('/')
	getAllPosts() {
		return this.postsService.getAllPosts();
	}

	@Get('/search')
	getPostByTitle(@Query('title') title: PostSchema['title']) {
		return this.postsService.getPostByTitle(title);
	}

	@Get('/:id')
	getPostById(@Param('id') id: PostSchema['id']) {
		return this.postsService.getPostById(id);
	}

	@Post()
	createPost(@Body() postDto: CreatePostDto) {
		return this.postsService.createPost(postDto);
	}

	@Patch('/:id')
	updatePost(@Param('id') id: PostSchema['id'], @Body() dto: UpdatePostDto) {
		return this.postsService.updatePost(id, dto);
	}

	@HttpCode(204)
	@Delete('/:id')
	deletePost(@Param('id') id: PostSchema['id']) {
		return this.postsService.deletePost(id);
	}
}
