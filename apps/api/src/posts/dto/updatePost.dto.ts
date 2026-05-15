import { createZodDto } from 'nestjs-zod';
import { updatePostSchema } from '@monorepo/schemas';

export class UpdatePostDto extends createZodDto(updatePostSchema) {}
