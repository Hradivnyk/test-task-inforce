import yaml from 'js-yaml';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const swaggerSpec = yaml.load(
  readFileSync(join(__dirname, '../docs/swagger.yaml'), 'utf8'),
);
