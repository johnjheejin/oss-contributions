# Soju06/codex-lb

Codex-lb is a proxy and load balancer that pools multiple ChatGPT accounts behind endpoints for Codex and OpenAI-compatible clients. Its dashboard provides account management, usage tracking and API-key controls for developers operating that shared account pool.

- Upstream: [Soju06/codex-lb](https://github.com/Soju06/codex-lb)
- Contribution fork: [johnjheejin/codex-lb](https://github.com/johnjheejin/codex-lb)
- Public registry: [`data/contributions.json`](../../data/contributions.json)

## Tracked contributions

| Stable ID | Pull request | Purpose |
|---|---|---|
| `github:Soju06/codex-lb#2595` | [#2595](https://github.com/Soju06/codex-lb/pull/2595) | Restore native stream documentation and require patched urllib3 2.8.0 |
| `github:Soju06/codex-lb#1526` | [#1526](https://github.com/Soju06/codex-lb/pull/1526) | Release SQLite handles before Windows backup and recovery file mutations |
| `github:Soju06/codex-lb#2114` | [#2114](https://github.com/Soju06/codex-lb/pull/2114) | Filter vendor events from public Responses streams; partial fix for #1934 |

## Upstream references

Status checked 2026-10-11: #2595 is open and mergeable on head `1b55e5b9e893f0a864cca81508188838bbd8bb8d`. The follow-up adds the urllib3 minimum version `>=2.8.0` and locks 2.8.0 alongside the documentation correction. [CI run 38045484809](https://github.com/Soju06/codex-lb/actions/runs/38045484809) succeeded, including the Docker Trivy high-severity gate, CI Required, application tests, dashboard browser smoke, lint, type checking, packaging and migration checks. Frontend and Helm jobs were skipped by change detection. Release guards, simplicity budgets and Docs also passed. The earlier security-gate failure is superseded by this successful run; this does not claim the user's live installation was updated. Existing dependency PRs [#2588](https://github.com/Soju06/codex-lb/pull/2588) and [#2573](https://github.com/Soju06/codex-lb/pull/2573) remain open; no duplicate dependency PR was created.

- The [README Contributors section](https://github.com/Soju06/codex-lb#contributors-) lists `daydreamer.jin` (`@johnjheejin`) with a profile image and code, tests and documentation credits.
- The [v1.23.0 release notes](https://github.com/Soju06/codex-lb/releases/tag/v1.23.0) include #1526 and introduce `@johnjheejin` under New Contributors.
- The [v1.25.0-beta.6 release notes](https://github.com/Soju06/codex-lb/releases/tag/v1.25.0-beta.6) credit `@johnjheejin` for #2114, which filters vendor events from public Responses streams while preserving native Codex streams.

References checked on 2026-09-15. Implementation details, review discussion and current workflow status stay in the pull request.
