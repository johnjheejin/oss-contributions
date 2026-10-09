# companyjupiter/quarkify

Quarkify analyzes source code locally and materializes its structure as a directory tree, with a standalone visual code map. It helps developers and AI coding agents explore files, symbols and relationships using familiar filesystem tools.

- Upstream: [companyjupiter/quarkify](https://github.com/companyjupiter/quarkify)
- Contribution fork: [johnjheejin/quarkify](https://github.com/johnjheejin/quarkify)
- Public registry: [`data/contributions.json`](../../data/contributions.json)

## Tracked contributions

| Stable ID | Pull request | Purpose |
|---|---|---|
| `github:companyjupiter/quarkify#59` | [#59](https://github.com/companyjupiter/quarkify/pull/59) | Include JSX/TSX in symbol coverage audits |
| `github:companyjupiter/quarkify#28` | [#28](https://github.com/companyjupiter/quarkify/pull/28) | Report generated artifact paths correctly |
| `github:companyjupiter/quarkify#29` | [#29](https://github.com/companyjupiter/quarkify/pull/29) | Treat project names as text in generated HTML |
| `github:companyjupiter/quarkify#30` | [#30](https://github.com/companyjupiter/quarkify/pull/30) | Run only the actual automated test suite |
| `github:companyjupiter/quarkify#31` | [#31](https://github.com/companyjupiter/quarkify/pull/31) | Remove an unused runtime dependency |
| `github:companyjupiter/quarkify#46` | [#46](https://github.com/companyjupiter/quarkify/pull/46) | Restore package entrypoint and CLI metadata on main |
| `github:companyjupiter/quarkify#47` | [#47](https://github.com/companyjupiter/quarkify/pull/47) | Keep package and plugin manifest versions aligned during releases |

Current lifecycle status is generated in the repository README. Implementation details and review discussion stay in each pull request.

Status checked 2026-10-10: #59 is open and mergeable; upstream CI passed on head a39b031, including Ubuntu, macOS, and Windows with Node 22. The patch improves coverage-audit dispatch and does not implement missing callback parsing.

Status checked 2026-10-06 09:42 UTC: [#46](https://github.com/companyjupiter/quarkify/pull/46) and [#47](https://github.com/companyjupiter/quarkify/pull/47) remain open and mergeable. Both head commits have successful upstream [CI runs](https://github.com/companyjupiter/quarkify/actions); neither PR has a submitted review or inline review thread. The contributor's 2026-09-21 validation follow-ups remain the latest comments, with no revision requested.

## Upstream references

The [GitHub contributor history](https://github.com/companyjupiter/quarkify/graphs/contributors) lists `@johnjheejin`. The merged work covers safe handling of project names in generated HTML (#29), test discovery (#30) and removal of an unused dependency (#31).

Reference checked on 2026-09-06.
