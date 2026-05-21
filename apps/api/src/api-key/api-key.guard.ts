import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { TypedEnvs } from '../types/TypedEnvs';

@Injectable()
export class ApiKeyGuard implements CanActivate {
	private apiKeyHeaderKey = 'x-api-key';

	constructor(private readonly config: TypedEnvs) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request: Request = context.switchToHttp().getRequest();

		return request.headers[this.apiKeyHeaderKey] === this.config.get('API_KEY', { infer: true });
	}
}
