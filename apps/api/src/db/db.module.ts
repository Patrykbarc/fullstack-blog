import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDb } from '@monorepo/db';
import type { TypedEnvs } from '../types/TypedEnvs';

export const DB = Symbol('DB');

@Global()
@Module({
	providers: [
		{
			provide: DB,
			inject: [ConfigService],
			useFactory: (config: TypedEnvs) => {
				const { db } = createDb(config.get('DATABASE_URL', { infer: true }));
				return db;
			},
		},
	],
	exports: [DB],
})
export class DbModule {}
