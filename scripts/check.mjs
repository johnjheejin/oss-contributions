import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderLedgerPages } from './lib/registry.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = path.join(repoRoot, 'data', 'contributions.json');
const registryText = fs.readFileSync(registryPath, 'utf8');
const registry = JSON.parse(registryText);
const expectedPages = renderLedgerPages(registry);
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

for (const [relativePath, expected] of Object.entries(expectedPages)) {
  const pagePath = path.join(repoRoot, relativePath);
  if (!fs.statSync(pagePath, { throwIfNoEntry: false })?.isFile()) {
    errors.push(`missing generated page: ${relativePath}`);
  } else if (fs.readFileSync(pagePath, 'utf8') !== expected) {
    errors.push(`${relativePath} is not synchronized with data/contributions.json`);
  }
}

if (errors.length > 0) {
  throw new Error(`Repository check failed:\n- ${errors.join('\n- ')}`);
}
console.log(
  `Repository check passed: ${registry.repositories.length} projects, ${registry.contributions.length} contributions.`,
);
