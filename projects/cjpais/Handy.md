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
| `github:cjpais/Handy#2247` | [#2247](https://github.com/cjpais/Handy/pull/2247) | Preserve playback position when starting a seek |
| `github:cjpais/Handy#2248` | [#2248](https://github.com/cjpais/Handy/pull/2248) | Ignore IME confirmation Enter in text inputs |
| `github:cjpais/Handy#2251` | [#2251](https://github.com/cjpais/Handy/pull/2251) | Dismiss focused setting tooltips with Escape |

Status checked 2026-10-09: #2235 was merged on 2026-10-08. #2238 remains open; its current head 458988d passed the upstream Playwright, code quality, and nix build check workflows. These automated checks do not establish actual desktop-app or screen-reader testing, which remains unverified here.

No pull-request-triggered workflow runs were returned for the documentation PR head 858d371. Its record therefore distinguishes the confirmed merge from automated validation evidence.

The Escape follow-up was submitted as #2246 on 2026-10-09. Its head 517c671 passed the upstream code quality, Playwright, and nix build check workflows; actual desktop-app and assistive-technology testing is not established by those checks.

Current lifecycle status is generated in the repository README. Implementation details and review discussion stay in each pull request. Only submitted public PRs are counted in this ledger.

Status checked 2026-10-09 15:00 UTC: #2247, #2248, and #2251 are submitted and open. Their respective heads b425616, 7b0157c, and 99fa16e each passed code quality, Playwright, and nix build check workflows. This records automated evidence without claiming actual desktop-app or assistive-technology testing.
