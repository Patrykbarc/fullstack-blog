import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { LoggerMiddleware } from './logger/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './constants/env.generated';
import { DbModule } from './db/db.module';
import { ApiKeyController } from './api-key/api-key.controller';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true, validate: (raw) => envSchema.parse(raw) }),
		DbModule,
		PostsModule,
	],
	controllers: [AppController, ApiKeyController],
	providers: [AppService, { provide: APP_PIPE, useClass: ZodValidationPipe }],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('posts');
	}
}
