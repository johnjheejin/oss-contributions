import fs from 'node:fs';
import path from 'node:path';
import { renderLedgerPages } from './registry.mjs';

export function writeLedgerPages(repoRoot, registry) {
  const changedFiles = [];
  for (const [relativePath, rendered] of Object.entries(renderLedgerPages(registry))) {
    const destination = path.join(repoRoot, relativePath);
    if (fs.statSync(destination, { throwIfNoEntry: false })?.isFile()
      && fs.readFileSync(destination, 'utf8') === rendered) continue;

    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, rendered, 'utf8');
    changedFiles.push(relativePath);
  }
  return changedFiles;
}
