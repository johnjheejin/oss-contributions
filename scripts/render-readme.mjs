import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderReadme, validateRegistry } from './lib/registry.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = path.join(repoRoot, 'data', 'contributions.json');
const readmePath = path.join(repoRoot, 'README.md');
const registry = validateRegistry(JSON.parse(fs.readFileSync(registryPath, 'utf8')));
const rendered = renderReadme(registry);
const current = fs.statSync(readmePath, { throwIfNoEntry: false })?.isFile()
  ? fs.readFileSync(readmePath, 'utf8')
  : null;

if (current === rendered) {
  console.log('README.md is already current.');
} else {
  fs.writeFileSync(readmePath, rendered, 'utf8');
  console.log('Rendered README.md from data/contributions.json.');
}
