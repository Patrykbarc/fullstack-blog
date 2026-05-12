import { mkdirSync, existsSync, statSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import type { EnvParser } from './EnvParser.js';
import type { ConfigLoader, Config } from './ConfigLoader.js';
import type { TemplateSync } from './TemplateSync.js';
import { CodeGenerator } from './CodeGenerator.js';

export class CLI {
	constructor(
		private parser: EnvParser,
		private configLoader: ConfigLoader,
		private templateSync: TemplateSync,
	) {}

	async run(): Promise<void> {
		const { default: inquirer } = await import('inquirer');

		const cwd = process.cwd();
		const defaults = this.configLoader.load(cwd);

		const answers = await inquirer.prompt<Config & { saveConfig: boolean }>([
			{
				type: 'input',
				name: 'envFile',
				message: 'Path to .env file:',
				default: defaults.envFile,
			},
			{
				type: 'input',
				name: 'outputDir',
				message: 'Output directory:',
				default: defaults.outputDir,
			},
			{
				type: 'input',
				name: 'outputFile',
				message: 'Output filename:',
				default: defaults.outputFile,
			},
			{
				type: 'list',
				name: 'envSource',
				message: 'Env source in getEnvs:',
				choices: ['process.env', 'import.meta.env'],
				default: defaults.envSource,
			},
			{
				type: 'input',
				name: 'typeName',
				message: 'Type name:',
				default: defaults.typeName,
			},
			{
				type: 'confirm',
				name: 'generateGetEnvs',
				message: 'Generate getEnvs function in file?',
				default: defaults.generateGetEnvs,
			},
			{
				type: 'confirm',
				name: 'saveConfig',
				message: 'Save configuration to env-types.config.json?',
				default: false,
			},
		]);

		const { saveConfig, ...config } = answers;

		if (saveConfig) {
			this.configLoader.save(config, cwd);
		}

		let envPath = join(cwd, config.envFile);
		if (existsSync(envPath) && statSync(envPath).isDirectory()) {
			envPath = join(envPath, '.env');
		}
		const { entries } = this.parser.parseFile(envPath);

		const generator = new CodeGenerator(config);
		const code = generator.generate(entries);

		const outDir = join(dirname(envPath), config.outputDir);
		if (!existsSync(outDir)) {
			mkdirSync(outDir, { recursive: true });
		}

		const outPath = join(outDir, config.outputFile);
		writeFileSync(outPath, code, 'utf-8');
		const relOutPath = outPath.replace(cwd + '/', '');
		console.log(`✅ Generated: ${relOutPath}`);

		const templatePath = join(dirname(envPath), '.env.template');
		const syncResult = this.templateSync.sync(entries, templatePath);

		const relTemplatePath = templatePath.replace(cwd + '/', '');
		console.log(`✅ Synced: ${relTemplatePath}`);

		if (syncResult.added.length > 0) {
			console.log(`   Added: ${syncResult.added.join(', ')}`);
		}
		if (syncResult.removed.length > 0) {
			console.log(`   Removed: ${syncResult.removed.join(', ')}`);
		}
	}
}
