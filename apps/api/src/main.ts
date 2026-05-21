import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { TypedEnvs } from './types/TypedEnvs';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const config = app.get<TypedEnvs>(ConfigService);
	await app.listen(config.get('PORT', { infer: true }));
}
void bootstrap();
