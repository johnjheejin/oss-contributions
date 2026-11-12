import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeLedgerPages } from './lib/ledger-files.mjs';
import {
  mergePullRequest,
  normalizePullRequest,
  validateRegistry,
} from './lib/registry.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = path.join(repoRoot, 'data', 'contributions.json');
const currentRegistryText = fs.readFileSync(registryPath, 'utf8');
const registry = validateRegistry(JSON.parse(currentRegistryText));
const repositories = new Map(registry.repositories.map((repository) => [repository.id, repository]));
const changedAt = process.env.SYNCED_AT || new Date().toISOString();
const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function fetchPullRequest(repository, number) {
  const response = await fetch(`https://api.github.com/repos/${repository}/pulls/${number}`, { headers });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub request failed for ${repository}#${number}: ${response.status} ${body}`);
  }
  return normalizePullRequest(await response.json());
}

const observations = await Promise.all(
  registry.contributions.map(async (contribution) => {
    const repository = repositories.get(contribution.repository);
    const observed = await fetchPullRequest(repository.upstream, contribution.pullRequest.number);
    return mergePullRequest(contribution, observed, changedAt);
  }),
);
const stateChanged = observations.some((observation) => observation.changed);
const nextRegistry = {
  ...registry,
  lastChangedAt: stateChanged ? changedAt : registry.lastChangedAt,
  contributions: observations.map((observation) => observation.contribution),
};
const nextRegistryText = `${JSON.stringify(nextRegistry, null, 2)}\n`;
const changedFiles = writeLedgerPages(repoRoot, nextRegistry);

if (nextRegistryText !== currentRegistryText) {
  fs.writeFileSync(registryPath, nextRegistryText, 'utf8');
  changedFiles.unshift('data/contributions.json');
}

if (changedFiles.length === 0) {
  console.log('No tracked contribution changes.');
} else {
  console.log(`Updated ${changedFiles.join(', ')}.`);
}
