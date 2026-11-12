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
- The generated `README.md` showcases work that landed upstream. The generated `history/README.md` lists all tracked authored PRs by lifecycle status.
- Upstream repositories and contribution forks remain authoritative for code and review discussion.
- Project pages provide context but do not override GitHub state.

When upstream lands a contribution through a different PR, the original record may include `landedVia` with the merged PR number in the same upstream repository, the full commit SHA, and the original PR's attribution comment ID as a string. Verify these against public upstream evidence. This does not change the original PR's state or add the maintainer's PR to the authored totals.

If that carry is reverted and later re-landed, point `landedVia` at the latest landing and preserve the initial merge, revert, and re-land evidence on the project page. The attribution comment may refer to the initial carry; the project history must connect it to the current landing.

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

The scheduled workflow reads public pull-request state from GitHub. It updates these tracked lifecycle fields in the registry and keeps both generated pages in sync:

- title
- author
- open, closed, or merged state
- draft state
- base branch
- created, closed, or merged timestamps

Comments and unrelated activity do not create registry commits.
