import assert from 'node:assert/strict';
import test from 'node:test';
import {
  findUntrackedExternalPullRequests,
  mergePullRequest,
  normalizePullRequest,
  renderLedgerPages,
  validateRegistry,
} from '../scripts/lib/registry.mjs';

function fixture() {
  return {
    schemaVersion: 1,
    lastChangedAt: '2026-07-26T00:00:00Z',
    repositories: [
      {
        id: 'github:example/project',
        upstream: 'example/project',
        upstreamUrl: 'https://github.com/example/project',
        fork: 'contributor/project',
        forkUrl: 'https://github.com/contributor/project',
        projectPage: 'projects/example/project.md',
        visibility: 'public',
      },
    ],
    contributions: [
      {
        id: 'github:example/project#7',
        repository: 'github:example/project',
        type: 'fix',
        summary: 'Fix a reproducible problem.',
        pullRequest: {
          number: 7,
          url: 'https://github.com/example/project/pull/7',
          title: 'fix: reproducible problem',
          author: 'contributor',
          state: 'open',
          draft: true,
          base: 'main',
          createdAt: '2026-07-26T00:00:00Z',
          mergedAt: null,
          closedAt: null,
          lastChangedAt: '2026-07-26T00:00:00Z',
        },
        validation: {
          status: 'passed',
          checks: ['npm test'],
        },
      },
    ],
  };
}

test('accepts a public registry with stable contribution IDs', () => {
  const registry = fixture();
  assert.equal(validateRegistry(registry), registry);
});

test('rejects private repository records and duplicate contribution IDs', () => {
  const registry = fixture();
  registry.repositories[0].visibility = 'private';
  registry.contributions.push(structuredClone(registry.contributions[0]));
  assert.throws(
    () => validateRegistry(registry),
    /visibility must be public[\s\S]*duplicate contribution id/u,
  );
});

test('normalizes merged pull requests from the GitHub payload', () => {
  const normalized = normalizePullRequest({
    number: 7,
    html_url: 'https://github.com/example/project/pull/7',
    title: 'fix: reproducible problem',
    user: { login: 'contributor' },
    state: 'closed',
    draft: false,
    base: { ref: 'main' },
    created_at: '2026-07-26T00:00:00Z',
    merged_at: '2026-07-27T00:00:00Z',
    closed_at: '2026-07-27T00:00:00Z',
  });
  assert.equal(normalized.state, 'merged');
  assert.equal(normalized.mergedAt, '2026-07-27T00:00:00Z');
});

test('updates lifecycle state only when tracked pull-request fields change', () => {
  const contribution = fixture().contributions[0];
  const unchanged = mergePullRequest(
    contribution,
    {
      number: 7,
      url: 'https://github.com/example/project/pull/7',
      title: 'fix: reproducible problem',
      author: 'contributor',
      state: 'open',
      draft: true,
      base: 'main',
      createdAt: '2026-07-26T00:00:00Z',
      mergedAt: null,
      closedAt: null,
    },
    '2026-07-27T00:00:00Z',
  );
  assert.equal(unchanged.changed, false);
  assert.equal(unchanged.contribution, contribution);

  const ready = mergePullRequest(
    contribution,
    { ...unchanged.contribution.pullRequest, draft: false },
    '2026-07-27T00:00:00Z',
  );
  assert.equal(ready.changed, true);
  assert.equal(ready.contribution.pullRequest.draft, false);
  assert.equal(ready.contribution.pullRequest.lastChangedAt, '2026-07-27T00:00:00Z');
});

test('renders selected work and a separate deterministic history with no duplicated PRs', () => {
  const registry = fixture();
  const source = registry.contributions[0];
  for (const [number, state] of [[8, 'open'], [9, 'merged'], [10, 'closed'], [11, 'closed']]) {
    const record = structuredClone(source);
    record.id = `github:example/project#${number}`;
    Object.assign(record.pullRequest, {
      number,
      url: `https://github.com/example/project/pull/${number}`,
      draft: false,
      state,
      mergedAt: state === 'merged' ? '2026-07-27T00:00:00Z' : null,
      closedAt: state === 'open' ? null : '2026-07-27T00:00:00Z',
    });
    if (number === 10) record.landedVia = { number: 12, commit: 'a'.repeat(40), commentId: '123' };
    registry.contributions.push(record);
  }
  const pages = renderLedgerPages(registry);
  const { 'README.md': readme, 'history/README.md': history } = pages;
  assert.deepEqual(renderLedgerPages(registry), pages);
  assert.match(readme, /v1\.25\.0-beta\.6/u);
  assert.match(readme, /PRs merged directly: 1\..*\(history\/README\.md\)/u);
  assert.doesNotMatch(readme, /example\/project\/pull\//u);
  assert.match(history, /Tracked authored PRs: \*\*5\*\*/u);
  for (const [heading, number] of [
    ['Merged directly', 9],
    ['Closed — landed through another PR', 10],
    ['Open for review', 8],
    ['Draft', 7],
    ['Other closed PRs', 11],
  ]) {
    const section = history.split(`## ${heading} (1)\n`)[1]?.split('\n## ')[0];
    assert.ok(section?.includes(`[#${number} fix:`), `Expected PR #${number} in ${heading}`);
  }
  assert.equal([...history.matchAll(/\[#\d+ fix:/gu)].length, 5);
  assert.match(history, /\[Merged #12\].*\[Maintainer attribution\].*pull\/10#issuecomment-123/u);
  assert.match(history, /\[Project notes\]\(\.\.\/projects\/example\/project\.md\)/u);
  assert.match(history, /github:companyjupiter\/quarkify#29/u);
  assert.match(history, /\(\.\.\/projects\/example\/project\.md\)/u);
  assert.doesNotMatch(readme + history, /[A-Za-z]:\\/u);
});

test('rejects a landing reference to the original PR or an invalid commit and comment ID', () => {
  const registry = fixture();
  registry.contributions[0].landedVia = {
    number: 7,
    commit: 'deadbeef',
    commentId: 'https://example.com',
  };
  assert.throws(
    () => validateRegistry(registry),
    /landedVia\.number[\s\S]*landedVia\.commit[\s\S]*landedVia\.commentId/u,
  );
});

test('describes registered hf-hub work as a Handy dependency without showcasing an unmerged PR', () => {
  const registry = fixture();
  registry.repositories.push({
    id: 'github:cjpais/hf-hub',
    upstream: 'cjpais/hf-hub',
    upstreamUrl: 'https://github.com/cjpais/hf-hub',
    fork: 'contributor/hf-hub',
    forkUrl: 'https://github.com/contributor/hf-hub',
    projectPage: 'projects/cjpais/hf-hub.md',
    visibility: 'public',
  });
  const contribution = structuredClone(registry.contributions[0]);
  contribution.repository = 'github:cjpais/hf-hub';
  contribution.id = 'github:cjpais/hf-hub#7';
  contribution.pullRequest.url = 'https://github.com/cjpais/hf-hub/pull/7';
  contribution.pullRequest.draft = false;
  registry.contributions.push(contribution);
  const pages = renderLedgerPages(registry);
  assert.match(pages['history/README.md'], /\[hf-hub \(Handy dependency\)\]\(\.\.\/projects\/cjpais\/hf-hub\.md\)/u);
  assert.match(pages['history/README.md'], /https:\/\/github\.com\/cjpais\/hf-hub\/pull\/7/u);
  assert.doesNotMatch(pages['README.md'], /hf-hub\.md|hf-hub\/pull\/7/u);
});

test('finds authored external pull requests that are missing from the registry', () => {
  const registry = fixture();
  const missing = findUntrackedExternalPullRequests(
    registry,
    [
      {
        number: 7,
        title: 'tracked',
        state: 'open',
        html_url: 'https://github.com/example/project/pull/7',
        repository_url: 'https://api.github.com/repos/example/project',
        user: { login: 'contributor' },
      },
      {
        number: 9,
        title: 'missing external contribution',
        state: 'open',
        html_url: 'https://github.com/another/project/pull/9',
        repository_url: 'https://api.github.com/repos/another/project',
        user: { login: 'Contributor' },
      },
      {
        number: 3,
        title: 'self-owned work',
        state: 'open',
        html_url: 'https://github.com/contributor/private-notes/pull/3',
        repository_url: 'https://api.github.com/repos/contributor/private-notes',
        user: { login: 'contributor' },
      },
    ],
    'contributor',
  );

  assert.deepEqual(missing, [
    {
      id: 'github:another/project#9',
      repository: 'another/project',
      number: 9,
      title: 'missing external contribution',
      url: 'https://github.com/another/project/pull/9',
      state: 'open',
    },
  ]);
});

test('omits explicitly excluded repositories without hiding other missing contributions', () => {
  const items = [
    { number: 1, repository_url: 'https://api.github.com/repos/Personal/Utility', user: { login: 'contributor' } },
    { number: 2, repository_url: 'https://api.github.com/repos/Personal/Utility', user: { login: 'contributor' } },
    { number: 3, repository_url: 'https://api.github.com/repos/another/project', user: { login: 'contributor' } },
  ];
  assert.deepEqual(
    findUntrackedExternalPullRequests(fixture(), items, 'contributor', ['personal/utility']).map((item) => item.id),
    ['github:another/project#3'],
  );
  assert.equal(findUntrackedExternalPullRequests(fixture(), items, 'contributor').length, 3);
});
