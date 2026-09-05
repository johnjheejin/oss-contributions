import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  findUntrackedExternalPullRequests,
  validateRegistry,
} from './lib/registry.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registryPath = path.join(repoRoot, 'data', 'contributions.json');
const registry = validateRegistry(JSON.parse(fs.readFileSync(registryPath, 'utf8')));
const contributor = process.env.CONTRIBUTOR_LOGIN || 'johnjheejin';
const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'johnjheejin-oss-contributions',
};
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

async function fetchAuthoredPullRequests() {
  const items = [];
  const query = `is:pr author:${contributor}`;
  for (let page = 1; page <= 10; page += 1) {
    const url = new URL('https://api.github.com/search/issues');
    url.searchParams.set('q', query);
    url.searchParams.set('sort', 'updated');
    url.searchParams.set('order', 'desc');
    url.searchParams.set('per_page', '100');
    url.searchParams.set('page', String(page));
    const response = await fetch(url, { headers });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`GitHub pull request discovery failed: ${response.status} ${body}`);
    }
    const payload = await response.json();
    items.push(...payload.items);
    if (items.length >= payload.total_count || payload.items.length < 100) break;
  }
  return items;
}

const searchItems = await fetchAuthoredPullRequests();
const excludedRepositories = (process.env.DISCOVERY_EXCLUDED_REPOSITORIES || '')
  .split(/[\s,]+/u)
  .filter(Boolean);
const missing = findUntrackedExternalPullRequests(registry, searchItems, contributor, excludedRepositories);
if (missing.length === 0) {
  console.log(`Contribution discovery passed: ${contributor} has no untracked external pull requests within the public ledger scope.`);
} else {
  console.error(`Untracked external pull requests found (${missing.length}):`);
  for (const item of missing) console.error(`- ${item.id} ${item.url}`);
  console.error('Add each public contribution and its project page before the next successful audit.');
  process.exitCode = 1;
}
