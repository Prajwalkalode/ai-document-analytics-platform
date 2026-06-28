import fs from 'fs';
import path from 'path';
import { load } from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const specPath = path.resolve(__dirname, '..', '..', 'docs', 'openapi.yml');
const swaggerSpec = load(fs.readFileSync(specPath, 'utf8'));

export default swaggerSpec;
