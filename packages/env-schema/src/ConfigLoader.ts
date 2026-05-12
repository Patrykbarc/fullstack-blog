import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface Config {
	envFile: string;
	outputDir: string;
	outputFile: string;
	envSource: 'process.env' | 'import.meta.env';
	typeName: string;
	generateGetEnvs: boolean;
}

const CONFIG_FILENAME = 'env-types.config.json';

export class ConfigLoader {
	getDefaults(): Config {
		return {
			envFile: '.env',
			outputDir: 'src/constants',
			outputFile: 'env.generated.ts',
			envSource: 'process.env',
			typeName: 'EnvironmentVariables',
			generateGetEnvs: false,
		};
	}

	load(projectPath: string): Config {
		const configPath = join(projectPath, CONFIG_FILENAME);

		if (!existsSync(configPath)) {
			return this.getDefaults();
		}

		const raw = readFileSync(configPath, 'utf-8');
		const parsed = JSON.parse(raw) as Partial<Config>;

		return { ...this.getDefaults(), ...parsed };
	}

	save(config: Config, projectPath: string): void {
		const configPath = join(projectPath, CONFIG_FILENAME);
		writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf-8');
	}
}

export function defineConfig(config: Partial<Config>): Config {
	const loader = new ConfigLoader();
	return { ...loader.getDefaults(), ...config };
}
