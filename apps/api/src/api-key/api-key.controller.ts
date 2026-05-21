import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from './api-key.guard';

@Controller('auth')
export class ApiKeyController {
	@UseGuards(ApiKeyGuard)
	@Get('/verify')
	@HttpCode(HttpStatus.NO_CONTENT)
	verify() {
		return;
	}
}
