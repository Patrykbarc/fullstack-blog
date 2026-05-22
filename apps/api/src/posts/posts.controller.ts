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
	Req,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { Post as PostSchema } from '@monorepo/schemas';
import { ClerkAuthGuard, type RequestWithClerk } from '../auth/clerk-auth.guard';

const NAME_CLAIMS = ['fullName', 'name', 'email'] as const;

function authorFromRequest(req: RequestWithClerk): { id: string; name: string } {
	if (!req.auth) throw new UnauthorizedException();
	const claims = req.auth.sessionClaims;
	const name = NAME_CLAIMS.map((k) => claims[k]).find(
		(v): v is string => typeof v === 'string' && v.length > 0,
	);
	return { id: req.auth.userId, name: name ?? 'Unknown' };
}

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

	@UseGuards(ClerkAuthGuard)
	@Post()
	createPost(@Body() postDto: CreatePostDto, @Req() req: RequestWithClerk) {
		return this.postsService.createPost(postDto, authorFromRequest(req));
	}

	@UseGuards(ClerkAuthGuard)
	@Patch('/:id')
	updatePost(@Param('id') id: PostSchema['id'], @Body() dto: UpdatePostDto) {
		return this.postsService.updatePost(id, dto);
	}

	@UseGuards(ClerkAuthGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete('/:id')
	deletePost(@Param('id') id: PostSchema['id']) {
		return this.postsService.deletePost(id);
	}
}
