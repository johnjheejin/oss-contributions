# Soju06/codex-lb

Codex-lb is a proxy and load balancer that pools multiple ChatGPT accounts behind endpoints for Codex and OpenAI-compatible clients. Its dashboard provides account management, usage tracking and API-key controls for developers operating that shared account pool.

- Upstream: [Soju06/codex-lb](https://github.com/Soju06/codex-lb)
- Contribution fork: [johnjheejin/codex-lb](https://github.com/johnjheejin/codex-lb)
- Public registry: [`data/contributions.json`](../../data/contributions.json)

## Tracked contributions

| Stable ID | Pull request | Purpose |
|---|---|---|
| `github:Soju06/codex-lb#2595` | [#2595](https://github.com/Soju06/codex-lb/pull/2595) | Restore the stream normalizer docstring and clarify native mode |
| `github:Soju06/codex-lb#1526` | [#1526](https://github.com/Soju06/codex-lb/pull/1526) | Release SQLite handles before Windows backup and recovery file mutations |
| `github:Soju06/codex-lb#2114` | [#2114](https://github.com/Soju06/codex-lb/pull/2114) | Filter vendor events from public Responses streams; partial fix for #1934 |

## Upstream references

Status checked 2026-10-10: #2595 is open and mergeable. Release guards and simplicity budgets passed, but [CI run 37982791097](https://github.com/Soju06/codex-lb/actions/runs/37982791097) failed at the Docker Trivy high-severity gate: urllib3 2.7.0 has CVE-2026-97687 and CVE-2026-97689, with scanner-reported fixed version 2.8.0. Application tests, lint, and type checking succeeded. The PR changes a docstring rather than SSE logic or dependencies; restoring the docstring intentionally changes introspection metadata. No dependency repair is claimed.

- The [README Contributors section](https://github.com/Soju06/codex-lb#contributors-) lists `daydreamer.jin` (`@johnjheejin`) with a profile image and code, tests and documentation credits.
- The [v1.23.0 release notes](https://github.com/Soju06/codex-lb/releases/tag/v1.23.0) include #1526 and introduce `@johnjheejin` under New Contributors.
- The [v1.25.0-beta.6 release notes](https://github.com/Soju06/codex-lb/releases/tag/v1.25.0-beta.6) credit `@johnjheejin` for #2114, which filters vendor events from public Responses streams while preserving native Codex streams.

References checked on 2026-09-15. Implementation details, review discussion and current workflow status stay in the pull request.
