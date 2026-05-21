import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import type { TypedEnvs } from '../types/TypedEnvs';
import { API_KEY_HEADER } from '../constants/constants';

@Injectable()
export class ApiKeyGuard implements CanActivate {
	private apiKeyHeaderKey = API_KEY_HEADER;

	constructor(@Inject(ConfigService) private readonly config: TypedEnvs) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request: Request = context.switchToHttp().getRequest();

		return request.headers[this.apiKeyHeaderKey] === this.config.get('API_KEY', { infer: true });
	}
}
