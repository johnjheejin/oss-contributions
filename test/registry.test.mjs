import assert from 'node:assert/strict';
import test from 'node:test';
import {
  findUntrackedExternalPullRequests,
  mergePullRequest,
  normalizePullRequest,
  renderReadme,
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

test('renders a deterministic public dashboard', () => {
  const readme = renderReadme(fixture());
  assert.match(readme, /Tracked contributions: 1/u);
  assert.match(readme, /🟡 Draft/u);
  assert.match(readme, /github:companyjupiter\/quarkify#29/u);
  assert.doesNotMatch(readme, /[A-Za-z]:\\/u);
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
