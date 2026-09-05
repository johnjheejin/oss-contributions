const CONTRIBUTION_STATES = new Set(['open', 'closed', 'merged']);
const CONTRIBUTION_TYPES = new Set(['fix', 'security', 'test', 'maintenance', 'docs', 'feature']);
const VALIDATION_STATES = new Set(['passed', 'partial', 'pending', 'failed']);
const REPOSITORY_PATTERN = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/u;

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isTimestamp(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function markdownCell(value) {
  return String(value).replace(/\|/gu, '\\|').replace(/\r?\n/gu, ' ');
}

function repositoryUrl(repository) {
  return `https://github.com/${repository}`;
}

function repositoryFromSearchItem(item) {
  const apiMatch = item?.repository_url?.match(/\/repos\/([^/]+\/[^/]+)$/u);
  if (apiMatch) return apiMatch[1];
  const htmlMatch = item?.html_url?.match(/^https:\/\/github\.com\/([^/]+\/[^/]+)\/pull\/\d+(?:[/?#]|$)/u);
  return htmlMatch?.[1] ?? null;
}

export function findUntrackedExternalPullRequests(registry, searchItems, contributor) {
  validateRegistry(registry);
  if (!Array.isArray(searchItems)) throw new Error('GitHub search items must be an array');
  if (typeof contributor !== 'string' || contributor.trim() === '') {
    throw new Error('Contributor login is required');
  }

  const normalizedContributor = contributor.toLowerCase();
  const trackedIds = new Set(registry.contributions.map((item) => item.id.toLowerCase()));
  const missing = [];
  for (const item of searchItems) {
    const repository = repositoryFromSearchItem(item);
    if (!repository || !Number.isInteger(item?.number) || item.number <= 0) continue;
    if (item.user?.login?.toLowerCase() !== normalizedContributor) continue;
    if (repository.split('/')[0].toLowerCase() === normalizedContributor) continue;
    const id = `github:${repository}#${item.number}`;
    if (trackedIds.has(id.toLowerCase())) continue;
    missing.push({
      id,
      repository,
      number: item.number,
      title: item.title,
      url: item.html_url ?? `https://github.com/${repository}/pull/${item.number}`,
      state: item.state,
    });
  }
  return missing.sort((left, right) => left.id.localeCompare(right.id));
}

export function validateRegistry(registry) {
  const errors = [];

  if (!isObject(registry)) {
    throw new Error('Invalid contribution registry:\n- registry must be an object');
  }
  if (registry.schemaVersion !== 1) errors.push('schemaVersion must be 1');
  if (!isTimestamp(registry.lastChangedAt)) errors.push('lastChangedAt must be an ISO timestamp');
  if (!Array.isArray(registry.repositories)) errors.push('repositories must be an array');
  if (!Array.isArray(registry.contributions)) errors.push('contributions must be an array');

  const repositoryIds = new Set();
  for (const [index, repository] of (registry.repositories ?? []).entries()) {
    const prefix = `repositories[${index}]`;
    if (!isObject(repository)) {
      errors.push(`${prefix} must be an object`);
      continue;
    }
    const expectedId = `github:${repository.upstream}`;
    if (!REPOSITORY_PATTERN.test(repository.upstream ?? '')) errors.push(`${prefix}.upstream must be owner/name`);
    if (!REPOSITORY_PATTERN.test(repository.fork ?? '')) errors.push(`${prefix}.fork must be owner/name`);
    if (repository.id !== expectedId) errors.push(`${prefix}.id must be ${expectedId}`);
    if (repositoryIds.has(repository.id)) errors.push(`duplicate repository id: ${repository.id}`);
    repositoryIds.add(repository.id);
    if (repository.upstreamUrl !== repositoryUrl(repository.upstream)) {
      errors.push(`${prefix}.upstreamUrl must match upstream`);
    }
    if (repository.forkUrl !== repositoryUrl(repository.fork)) {
      errors.push(`${prefix}.forkUrl must match fork`);
    }
    if (repository.visibility !== 'public') errors.push(`${prefix}.visibility must be public`);
    if (
      typeof repository.projectPage !== 'string'
      || !repository.projectPage.startsWith('projects/')
      || repository.projectPage.includes('..')
    ) {
      errors.push(`${prefix}.projectPage must be a safe projects/ path`);
    }
  }

  const contributionIds = new Set();
  for (const [index, contribution] of (registry.contributions ?? []).entries()) {
    const prefix = `contributions[${index}]`;
    if (!isObject(contribution)) {
      errors.push(`${prefix} must be an object`);
      continue;
    }
    const repository = (registry.repositories ?? []).find((item) => item.id === contribution.repository);
    const pullRequest = contribution.pullRequest;
    if (!repositoryIds.has(contribution.repository)) errors.push(`${prefix}.repository is not registered`);
    if (!isObject(pullRequest)) {
      errors.push(`${prefix}.pullRequest must be an object`);
      continue;
    }
    const expectedId = repository
      ? `github:${repository.upstream}#${pullRequest.number}`
      : null;
    if (expectedId && contribution.id !== expectedId) errors.push(`${prefix}.id must be ${expectedId}`);
    if (contributionIds.has(contribution.id)) errors.push(`duplicate contribution id: ${contribution.id}`);
    contributionIds.add(contribution.id);
    if (!CONTRIBUTION_TYPES.has(contribution.type)) errors.push(`${prefix}.type is unsupported`);
    if (typeof contribution.summary !== 'string' || contribution.summary.trim() === '') {
      errors.push(`${prefix}.summary is required`);
    }
    if (!Number.isInteger(pullRequest.number) || pullRequest.number <= 0) {
      errors.push(`${prefix}.pullRequest.number must be a positive integer`);
    }
    if (repository && pullRequest.url !== `${repository.upstreamUrl}/pull/${pullRequest.number}`) {
      errors.push(`${prefix}.pullRequest.url must match the registered upstream`);
    }
    if (typeof pullRequest.title !== 'string' || pullRequest.title.trim() === '') {
      errors.push(`${prefix}.pullRequest.title is required`);
    }
    if (typeof pullRequest.author !== 'string' || pullRequest.author.trim() === '') {
      errors.push(`${prefix}.pullRequest.author is required`);
    }
    if (!CONTRIBUTION_STATES.has(pullRequest.state)) errors.push(`${prefix}.pullRequest.state is unsupported`);
    if (typeof pullRequest.draft !== 'boolean') errors.push(`${prefix}.pullRequest.draft must be boolean`);
    if (typeof pullRequest.base !== 'string' || pullRequest.base.trim() === '') {
      errors.push(`${prefix}.pullRequest.base is required`);
    }
    if (!isTimestamp(pullRequest.createdAt)) errors.push(`${prefix}.pullRequest.createdAt is invalid`);
    if (pullRequest.mergedAt !== null && !isTimestamp(pullRequest.mergedAt)) {
      errors.push(`${prefix}.pullRequest.mergedAt is invalid`);
    }
    if (pullRequest.closedAt !== null && !isTimestamp(pullRequest.closedAt)) {
      errors.push(`${prefix}.pullRequest.closedAt is invalid`);
    }
    if (!isTimestamp(pullRequest.lastChangedAt)) errors.push(`${prefix}.pullRequest.lastChangedAt is invalid`);
    if (!isObject(contribution.validation) || !VALIDATION_STATES.has(contribution.validation?.status)) {
      errors.push(`${prefix}.validation.status is unsupported`);
    }
    if (
      !Array.isArray(contribution.validation?.checks)
      || contribution.validation.checks.length === 0
      || contribution.validation.checks.some((check) => typeof check !== 'string' || check.trim() === '')
    ) {
      errors.push(`${prefix}.validation.checks must contain non-empty strings`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Invalid contribution registry:\n- ${errors.join('\n- ')}`);
  }
  return registry;
}

export function normalizePullRequest(payload) {
  if (!isObject(payload)) throw new Error('GitHub pull request payload must be an object');
  const mergedAt = payload.merged_at ?? null;
  return {
    number: payload.number,
    url: payload.html_url,
    title: payload.title,
    author: payload.user?.login,
    state: mergedAt ? 'merged' : payload.state,
    draft: Boolean(payload.draft),
    base: payload.base?.ref,
    createdAt: payload.created_at,
    mergedAt,
    closedAt: payload.closed_at ?? null,
  };
}

export function mergePullRequest(contribution, observedPullRequest, changedAt) {
  const current = contribution.pullRequest;
  if (current.number !== observedPullRequest.number) {
    throw new Error(`Pull request number mismatch for ${contribution.id}`);
  }
  const trackedFields = [
    'number',
    'url',
    'title',
    'author',
    'state',
    'draft',
    'base',
    'createdAt',
    'mergedAt',
    'closedAt',
  ];
  const changed = trackedFields.some((field) => current[field] !== observedPullRequest[field]);
  if (!changed) return { changed: false, contribution };
  return {
    changed: true,
    contribution: {
      ...contribution,
      pullRequest: {
        ...observedPullRequest,
        lastChangedAt: changedAt,
      },
    },
  };
}

export function statusLabel(pullRequest) {
  if (pullRequest.state === 'merged') return '🟣 Merged';
  if (pullRequest.state === 'closed') return '⚫ Closed';
  if (pullRequest.draft) return '🟡 Draft';
  return '🟢 Open';
}

export function renderReadme(registry) {
  validateRegistry(registry);
  const contributions = [...registry.contributions].sort((left, right) => {
    const repositoryOrder = left.repository.localeCompare(right.repository);
    return repositoryOrder || left.pullRequest.number - right.pullRequest.number;
  });
  const repositories = new Map(registry.repositories.map((repository) => [repository.id, repository]));
  const draftCount = contributions.filter((item) => item.pullRequest.state === 'open' && item.pullRequest.draft).length;
  const openCount = contributions.filter((item) => item.pullRequest.state === 'open' && !item.pullRequest.draft).length;
  const mergedCount = contributions.filter((item) => item.pullRequest.state === 'merged').length;
  const closedCount = contributions.filter((item) => item.pullRequest.state === 'closed').length;

  const lines = [
    '# Open-source contributions',
    '',
    'A public ledger of upstream contributions, validation evidence, and their current GitHub status.',
    '',
    '[![Sync contribution status](https://github.com/johnjheejin/oss-contributions/actions/workflows/sync.yml/badge.svg)](https://github.com/johnjheejin/oss-contributions/actions/workflows/sync.yml)',
    '',
    '> Public metadata only. Source code remains in upstream repositories and forks.',
    '',
    '## Snapshot',
    '',
    `- Tracked contributions: ${contributions.length}`,
    `- Draft: ${draftCount}`,
    `- Open for review: ${openCount}`,
    `- Merged: ${mergedCount}`,
    `- Closed without merge: ${closedCount}`,
    `- Registry last changed: ${registry.lastChangedAt}`,
    '',
    '## Selected work',
    '',
    '| Project | Contribution | Upstream reference |',
    '|---|---|---|',
    '| [Battery](projects/dennykim123/claude-codex-battery.md) | Native Windows tray app, production port and stabilization | [Windows contributor credit in README](https://github.com/dennykim123/claude-codex-battery#readme) |',
    '| [Porta](projects/L1M80/porta.md) | Conversation and subagent UI, tunnel documentation, regression coverage | [Acknowledgment in v0.16.1](https://github.com/L1M80/porta/releases/tag/v0.16.1) |',
    '| [Codex-lb](projects/Soju06/codex-lb.md) | SQLite handle cleanup before Windows file operations | [README contributor listing](https://github.com/Soju06/codex-lb#contributors-) · [v1.23.0 release](https://github.com/Soju06/codex-lb/releases/tag/v1.23.0) |',
    '| [Quarkify](projects/companyjupiter/quarkify.md) | Safe HTML generation, test scope and dependency cleanup | [Contributor history](https://github.com/companyjupiter/quarkify/graphs/contributors) |',
    '',
    '## Contributions',
    '',
    '| Status | Upstream | Pull request | Type | Validation |',
    '|---|---|---|---|---|',
  ];

  for (const contribution of contributions) {
    const repository = repositories.get(contribution.repository);
    const validation = contribution.validation.status === 'passed'
      ? `✅ ${contribution.validation.checks.length} checks`
      : `${contribution.validation.status} · ${contribution.validation.checks.length} checks`;
    lines.push(
      `| ${statusLabel(contribution.pullRequest)} | [${markdownCell(repository.upstream)}](${repository.upstreamUrl}) | [#${contribution.pullRequest.number} ${markdownCell(contribution.pullRequest.title)}](${contribution.pullRequest.url}) | ${contribution.type} | ${validation} |`,
    );
  }

  lines.push(
    '',
    '## Connected projects',
    '',
    '| Upstream | Contribution fork | Records |',
    '|---|---|---|',
  );
  for (const repository of registry.repositories) {
    const recordCount = contributions.filter((item) => item.repository === repository.id).length;
    lines.push(
      `| [${repository.upstream}](${repository.upstreamUrl}) | [${repository.fork}](${repository.forkUrl}) | [${recordCount}](${repository.projectPage}) |`,
    );
  }

  lines.push(
    '',
    '## Linking model',
    '',
    '- Every contribution has a stable ID such as `github:companyjupiter/quarkify#29`.',
    '- Public repositories may reference those IDs through `.github/oss-contributions.json`.',
    '- Private repositories may keep reverse references internally; private names and paths are never published here.',
    '- The scheduled workflow checks GitHub, commits tracked lifecycle changes, and fails visibly when an authored external pull request is missing from the registry.',
    '',
    'See [the linking contract](docs/linking-contract.md) and [contribution guide](CONTRIBUTING.md).',
    '',
    '<!-- This file is rendered from data/contributions.json. -->',
    '',
  );
  return lines.join('\n');
}
