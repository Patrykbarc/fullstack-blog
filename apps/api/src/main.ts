import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { TypedEnvs } from './types/TypedEnvs';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: true,
		methods: ['GET', 'POST', 'PATCH', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	});
	const config = app.get<TypedEnvs>(ConfigService);
	await app.listen(config.get('PORT', { infer: true }));
}
void bootstrap();
