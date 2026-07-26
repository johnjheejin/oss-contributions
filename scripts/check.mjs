import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderReadme, validateRegistry } from './lib/registry.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = path.join(repoRoot, 'data', 'contributions.json');
const readmePath = path.join(repoRoot, 'README.md');
const registryText = fs.readFileSync(registryPath, 'utf8');
const registry = validateRegistry(JSON.parse(registryText));
const errors = [];

const forbiddenLocalPathPatterns = [
  /[A-Za-z]:\\/u,
  /file:\/\//iu,
  /\/Users\//u,
  /\/home\//u,
];
for (const pattern of forbiddenLocalPathPatterns) {
  if (pattern.test(registryText)) errors.push(`registry contains a local path matching ${pattern}`);
}

for (const repository of registry.repositories) {
  const projectPath = path.join(repoRoot, repository.projectPage);
  if (!fs.statSync(projectPath, { throwIfNoEntry: false })?.isFile()) {
    errors.push(`missing project page: ${repository.projectPage}`);
  }
}

const expectedReadme = renderReadme(registry);
const actualReadme = fs.readFileSync(readmePath, 'utf8');
if (actualReadme !== expectedReadme) {
  errors.push('README.md is not synchronized with data/contributions.json');
}

if (errors.length > 0) {
  throw new Error(`Repository check failed:\n- ${errors.join('\n- ')}`);
}
console.log(
  `Repository check passed: ${registry.repositories.length} project, ${registry.contributions.length} contributions.`,
);
