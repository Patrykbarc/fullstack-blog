import {
	mkdirSync,
	existsSync,
	readFileSync,
	readdirSync,
	statSync,
	writeFileSync,
	type Dirent,
} from 'fs';
import { join, dirname, relative } from 'path';
import type { EnvParser } from './EnvParser.js';
import type { TemplateSync } from './TemplateSync.js';
import { CodeGenerator, type GeneratorOptions } from './CodeGenerator.js';

const IGNORED_DIRS = new Set([
	'node_modules',
	'dist',
	'build',
	'.git',
	'.next',
	'.turbo',
	'coverage',
]);

const IMPORT_META_DEPS = ['astro', 'vite'];

const OUTPUT_DIR = 'src/constants';
const OUTPUT_FILE = 'env.generated.ts';
const TYPE_NAME = 'EnvironmentVariables';

export class CLI {
	constructor(
		private parser: EnvParser,
		private templateSync: TemplateSync,
	) {}

	async run(root: string = process.cwd()): Promise<void> {
		const envFiles = this.findEnvFiles(root).filter((p) => this.isProjectDir(dirname(p)));

		if (envFiles.length === 0) {
			console.log('No project .env files found under', root);
			return;
		}

		for (const envPath of envFiles) {
			this.processEnvFile(envPath, root);
		}
	}

	private isProjectDir(dir: string): boolean {
		const srcPath = join(dir, 'src');
		return existsSync(srcPath) && statSync(srcPath).isDirectory();
	}

	private processEnvFile(envPath: string, cwd: string): void {
		const pkgDir = dirname(envPath);
		const envSource = this.detectEnvSource(pkgDir);

		const options: GeneratorOptions = {
			envSource,
			typeName: TYPE_NAME,
			generateGetEnvs: true,
		};

		const { entries } = this.parser.parseFile(envPath);

		const outDir = join(pkgDir, OUTPUT_DIR);
		if (!existsSync(outDir)) {
			mkdirSync(outDir, { recursive: true });
		}

		const outPath = join(outDir, OUTPUT_FILE);
		const code = new CodeGenerator(options).generate(entries);
		writeFileSync(outPath, code, 'utf-8');

		const templatePath = join(pkgDir, '.env.template');
		const syncResult = this.templateSync.sync(entries, templatePath);

		const label = relative(cwd, pkgDir) || '.';
		const counts = `+${syncResult.added.length} / -${syncResult.removed.length}`;
		console.log(`✅ ${label} (${envSource}) → ${OUTPUT_DIR}/${OUTPUT_FILE} (${counts})`);
	}

	private findEnvFiles(root: string): string[] {
		const results: string[] = [];
		this.walk(root, results);
		results.sort();
		return results;
	}

	private walk(dir: string, results: string[]): void {
		let entries: Dirent[];
		try {
			entries = readdirSync(dir, { withFileTypes: true }) as Dirent[];
		} catch {
			return;
		}

		for (const entry of entries) {
			const fullPath = join(dir, entry.name);
			if (entry.isDirectory()) {
				if (IGNORED_DIRS.has(entry.name) || entry.name.startsWith('.')) continue;
				this.walk(fullPath, results);
			} else if (entry.isFile() && entry.name === '.env') {
				results.push(fullPath);
			}
		}
	}

	private detectEnvSource(pkgDir: string): 'process.env' | 'import.meta.env' {
		const pkgPath = join(pkgDir, 'package.json');
		if (!existsSync(pkgPath) || !statSync(pkgPath).isFile()) {
			return 'process.env';
		}

		let pkg: { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
		try {
			pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
		} catch {
			return 'process.env';
		}

		const allDeps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
		for (const dep of Object.keys(allDeps)) {
			if (IMPORT_META_DEPS.includes(dep) || dep.startsWith('@vitejs/')) {
				return 'import.meta.env';
			}
		}
		return 'process.env';
	}
}
