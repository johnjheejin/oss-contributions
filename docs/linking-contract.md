# Repository linking contract

This contract connects public repositories without copying their source or exposing private working context.

## Stable identifiers

Each contribution uses:

```text
github:<upstream-owner>/<upstream-repository>#<pull-request-number>
```

Example:

```text
github:companyjupiter/quarkify#29
```

The identifier remains stable when a pull request moves from draft to review, merge, or closure.

## Canonical direction

- `data/contributions.json` is the public canonical registry.
- The generated `README.md` is the human-readable dashboard.
- Upstream repositories and contribution forks remain authoritative for code and review discussion.
- Project pages provide context but do not override GitHub state.

## Optional reverse link

A public repository may add `.github/oss-contributions.json`:

```json
{
  "schemaVersion": 1,
  "hub": "https://github.com/johnjheejin/oss-contributions",
  "contributionIds": [
    "github:companyjupiter/quarkify#29"
  ]
}
```

The file is a pointer only. It must not contain local paths, credentials, unpublished patches, or private repository names.

Private repositories may reference the same stable IDs internally, but this public hub never publishes their names or paths.

## Synchronization

The scheduled workflow reads public pull-request state from GitHub. It updates the registry and dashboard only when tracked lifecycle fields change:

- title
- author
- open, closed, or merged state
- draft state
- base branch
- created, closed, or merged timestamps

Comments and unrelated activity do not create registry commits.
