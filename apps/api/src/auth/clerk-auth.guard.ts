import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verifyToken } from '@clerk/backend';
import type { Request } from 'express';
import type { TypedEnvs } from '../types/TypedEnvs';

export type ClerkAuthContext = {
	userId: string;
	sessionClaims: Record<string, unknown>;
};

export type RequestWithClerk = Request & { auth?: ClerkAuthContext };

@Injectable()
export class ClerkAuthGuard implements CanActivate {
	constructor(@Inject(ConfigService) private readonly config: TypedEnvs) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<RequestWithClerk>();
		const header = request.headers.authorization;
		const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
		if (!token) {
			throw new UnauthorizedException('missing bearer token');
		}

		try {
			const payload = await verifyToken(token, {
				secretKey: this.config.get('CLERK_SECRET_KEY', { infer: true }),
			});
			if (!payload.sub) {
				throw new UnauthorizedException('token missing sub');
			}
			request.auth = {
				userId: payload.sub,
				sessionClaims: payload,
			};
			return true;
		} catch (cause) {
			throw new UnauthorizedException('invalid token', { cause });
		}
	}
}
