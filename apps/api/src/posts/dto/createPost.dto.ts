import { createZodDto } from 'nestjs-zod';
import { createPostSchema } from '@monorepo/schemas';

export class CreatePostDto extends createZodDto(createPostSchema) {}
