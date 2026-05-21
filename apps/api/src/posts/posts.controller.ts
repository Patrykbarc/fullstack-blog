import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { Post as PostSchema } from '@monorepo/schemas';
import { ApiKeyGuard } from '../api-key/api-key.guard';

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

	@Get('/slug/:slug')
	getPostBySlug(@Param('slug') slug: PostSchema['slug']) {
		return this.postsService.getPostBySlug(slug);
	}

	@Get('/:id')
	getPostById(@Param('id') id: PostSchema['id']) {
		return this.postsService.getPostById(id);
	}

	@UseGuards(ApiKeyGuard)
	@Post()
	createPost(@Body() postDto: CreatePostDto) {
		return this.postsService.createPost(postDto);
	}

	@UseGuards(ApiKeyGuard)
	@Patch('/:id')
	updatePost(@Param('id') id: PostSchema['id'], @Body() dto: UpdatePostDto) {
		return this.postsService.updatePost(id, dto);
	}

	@UseGuards(ApiKeyGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('/:id')
	deletePost(@Param('id') id: PostSchema['id']) {
		return this.postsService.deletePost(id);
	}
}
