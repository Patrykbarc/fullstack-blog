import { EnvParser } from './EnvParser.js';
import { TemplateSync } from './TemplateSync.js';
import { CLI } from './CLI.js';

const cli = new CLI(new EnvParser(), new TemplateSync());

cli.run().catch((err: unknown) => {
	console.error('Error:', err);
	process.exit(1);
});
