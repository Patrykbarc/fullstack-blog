import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { DB } from '../db/db.module';

describe('PostsController', () => {
	let controller: PostsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [PostsController],
			providers: [PostsService, { provide: DB, useValue: {} }],
		}).compile();

		controller = module.get<PostsController>(PostsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
