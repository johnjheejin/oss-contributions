import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeLedgerPages } from './lib/ledger-files.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = path.join(repoRoot, 'data', 'contributions.json');
const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const changedFiles = writeLedgerPages(repoRoot, registry);

if (changedFiles.length === 0) {
  console.log('Ledger pages are already current.');
} else {
  console.log(`Rendered ${changedFiles.join(', ')} from data/contributions.json.`);
}
