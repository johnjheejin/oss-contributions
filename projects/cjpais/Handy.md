# cjpais/Handy

Handy is an offline speech-to-text desktop app. It runs transcription models locally and lets users dictate text into other applications with a keyboard shortcut.

- Upstream: [cjpais/Handy](https://github.com/cjpais/Handy)
- Contribution fork: [johnjheejin/Handy](https://github.com/johnjheejin/Handy)
- Public registry: [`data/contributions.json`](../../data/contributions.json)

## Tracked contributions

| Stable ID | Pull request | Purpose |
|---|---|---|
| `github:cjpais/Handy#2235` | [#2235](https://github.com/cjpais/Handy/pull/2235) | Align translation contribution guidance with supported locales |
| `github:cjpais/Handy#2238` | [#2238](https://github.com/cjpais/Handy/pull/2238) | Expose setting names, including slider controls, to screen readers |
| `github:cjpais/Handy#2246` | [#2246](https://github.com/cjpais/Handy/pull/2246) | Dismiss dropdown menus with Escape and restore focus to the trigger |

Status checked 2026-10-09: #2235 was merged on 2026-10-08. #2238 remains open; its current head 458988d passed the upstream Playwright, code quality, and nix build check workflows. These automated checks do not establish actual desktop-app or screen-reader testing, which remains unverified here.

No pull-request-triggered workflow runs were returned for the documentation PR head 858d371. Its record therefore distinguishes the confirmed merge from automated validation evidence.

The Escape follow-up was submitted as #2246 on 2026-10-09. Its head 517c671 passed the upstream code quality, Playwright, and nix build check workflows; actual desktop-app and assistive-technology testing is not established by those checks.

Current lifecycle status is generated in the repository README. Implementation details and review discussion stay in each pull request. Only submitted public PRs are counted in this ledger.
