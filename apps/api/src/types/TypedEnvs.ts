import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../constants/env.generated';

export type TypedEnvs = ConfigService<EnvironmentVariables, true>;
