# cjpais/Handy

Handy is an offline speech-to-text desktop app. It runs transcription models locally and lets users dictate text into other applications with a keyboard shortcut.

- Upstream: [cjpais/Handy](https://github.com/cjpais/Handy)
- Contribution fork: [johnjheejin/Handy](https://github.com/johnjheejin/Handy)
- Public registry: [`data/contributions.json`](../../data/contributions.json)

## Tracked contributions

| Stable ID | Pull request | Purpose |
|---|---|---|
| `github:cjpais/Handy#2318` | [#2318](https://github.com/cjpais/Handy/pull/2318) | Stop oversized Hugging Face downloads while preserving transfer-rate reporting |
| `github:cjpais/Handy#2309` | [#2309](https://github.com/cjpais/Handy/pull/2309) | Release late-loaded audio sources after leaving history |
| `github:cjpais/Handy#2308` | [#2308](https://github.com/cjpais/Handy/pull/2308) | Ignore stale post-processing model lists after connection changes |
| `github:cjpais/Handy#2307` | [#2307](https://github.com/cjpais/Handy/pull/2307) | Preserve unrelated settings when a setting update fails |
| `github:cjpais/Handy#2300` | [#2300](https://github.com/cjpais/Handy/pull/2300) | Require parameter support for OpenRouter structured-output requests |
| `github:cjpais/Handy#2290` | [#2290](https://github.com/cjpais/Handy/pull/2290) | Preserve the original transcript when post-processing returns blank output |
| `github:cjpais/Handy#2253` | [#2253](https://github.com/cjpais/Handy/pull/2253) | Identify the setting affected by reset buttons |
| `github:cjpais/Handy#2254` | [#2254](https://github.com/cjpais/Handy/pull/2254) | Name the audio playback position control |
| `github:cjpais/Handy#2255` | [#2255](https://github.com/cjpais/Handy/pull/2255) | Report failed history deletions to users |
| `github:cjpais/Handy#2256` | [#2256](https://github.com/cjpais/Handy/pull/2256) | Avoid duplicate history rows during live updates |
| `github:cjpais/Handy#2235` | [#2235](https://github.com/cjpais/Handy/pull/2235) | Align translation contribution guidance with supported locales |
| `github:cjpais/Handy#2238` | [#2238](https://github.com/cjpais/Handy/pull/2238) | Expose setting names, including slider controls, to screen readers |
| `github:cjpais/Handy#2246` | [#2246](https://github.com/cjpais/Handy/pull/2246) | Dismiss dropdown menus with Escape and restore focus to the trigger |
| `github:cjpais/Handy#2247` | [#2247](https://github.com/cjpais/Handy/pull/2247) | Preserve playback position when starting a seek |
| `github:cjpais/Handy#2248` | [#2248](https://github.com/cjpais/Handy/pull/2248) | Ignore IME confirmation Enter in text inputs |
| `github:cjpais/Handy#2251` | [#2251](https://github.com/cjpais/Handy/pull/2251) | Dismiss focused setting tooltips with Escape |

Status checked 2026-10-14: #2235 was merged on 2026-10-08. #2238 was merged on 2026-10-14 at 00:36:53 UTC; its head 458988d passed the upstream Playwright, code quality, and nix build check workflows. These automated checks do not establish actual desktop-app or screen-reader testing, which remains unverified here.

No pull-request-triggered workflow runs were returned for the documentation PR head 858d371. Its record therefore distinguishes the confirmed merge from automated validation evidence.

The Escape follow-up was submitted as #2246 on 2026-10-09. Its head 517c671 passed the upstream code quality, Playwright, and nix build check workflows; actual desktop-app and assistive-technology testing is not established by those checks.

Current lifecycle status is generated in the repository README. Implementation details and review discussion stay in each pull request. Only submitted public PRs are counted in this ledger.

### Translation review follow-up

The maintainer requested translations for [#2253](https://github.com/cjpais/Handy/pull/2253#issuecomment-6157768896) and [#2254](https://github.com/cjpais/Handy/pull/2254#issuecomment-6157763002). Corrections were published to both existing PRs on 2026-10-15, replacing English fallback text in 24 locales per PR.

| PR | Published commit | Successful checks on heads verified 2026-10-26 |
|---|---|---|
| #2253: setting-reset labels | [7e758f4](https://github.com/johnjheejin/Handy/commit/7e758f4bc6cbbcfc512fefb539c53161fc744d89) | [Playwright: 9 passed](https://github.com/cjpais/Handy/actions/runs/40290255856), [code quality](https://github.com/cjpais/Handy/actions/runs/40290255825), [Nix quick checks](https://github.com/cjpais/Handy/actions/runs/40290255840) |
| #2254: playback-position label | [07de12c](https://github.com/johnjheejin/Handy/commit/07de12ce035e7eb329bacc1c77d4049cc8651be4) | [Playwright](https://github.com/cjpais/Handy/actions/runs/38691830943), [code quality](https://github.com/cjpais/Handy/actions/runs/38691830960), [nix build](https://github.com/cjpais/Handy/actions/runs/38691830845) |

The initial #2253 translation correction remains in [1655fe4](https://github.com/johnjheejin/Handy/commit/1655fe49203af29fe8b930c3ec238cb7c25aa10d). The later Hindi correction [16b7918](https://github.com/johnjheejin/Handy/commit/16b7918e7c8cf338af5612fa3885a09489406d81) separates the setting name from the reset action with a colon, so existing setting names can be reused without grammatical case changes. The `{{setting}}` placeholder is preserved. Those earlier checks included translation keys, placeholders, eight Hindi interpolations, lint, formatting and the TypeScript/Vite build.

The published maintenance head `7e758f4` ports the labels to main `73c0958` and its unified `ShortcutInput`, retaining the Hindi wording. The updated PR body records all 26 locale/placeholder checks, application and fixture TypeScript, lint and formatting. Its Playwright CI passed seven new browser regressions and two existing smoke tests. Native services are replaced in the browser fixture; native-speaker review, native shortcut capture and real screen-reader behavior remain unverified. Nix quick checks passed but skipped the full native build. The separate Windows production-bundle termination also reproduces on unchanged main; this record does not claim a current production or installed-app build. Maintainer acceptance remains pending.

#2256 was merged on 2026-10-13 at 23:59:19 UTC. #2255 remains open with successful Playwright, code quality and nix build checks on its submitted head, as observed on 2026-10-14.

Status checked 2026-10-09 15:00 UTC: #2247, #2248, and #2251 are submitted and open. Their respective heads b425616, 7b0157c, and 99fa16e each passed code quality, Playwright, and nix build check workflows. This records automated evidence without claiming actual desktop-app or assistive-technology testing.

### Blank post-processing result

Status checked 2026-10-18: [#2290](https://github.com/cjpais/Handy/pull/2290) is open on head `3ed4bdb63848508fbee30358a335359ea6c77418`. It preserves the original transcript when post-processing returns empty or whitespace-only output. The current head passed [Rust tests](https://github.com/cjpais/Handy/actions/runs/38871944786) and the [Nix build](https://github.com/cjpais/Handy/actions/runs/38871944802). No submitted review was returned by the GitHub reviews API at this check; maintainer acceptance and live desktop behavior remain unverified.

That 2026-10-18 check confirmed #2235, #2238 and #2256 as merged, and #2246, #2247, #2248, #2251, #2253, #2254 and #2255 as open. At that check, #2253 used 1655fe4 and #2254 used 07de12c, each with three successful current-head checks. The newer #2253 head and evidence are documented in the translation follow-up above. Native-speaker review and maintainer acceptance remain unverified.

### Request routing and asynchronous settings/history fixes

Status checked 2026-10-21: the following submitted public PRs are open. No submitted reviews were returned for these heads by the GitHub reviews API. CI success records automated evidence; maintainer acceptance remains pending.

| PR | Purpose and published head | Successful current-head checks |
|---|---|---|
| [#2300](https://github.com/cjpais/Handy/pull/2300) | Require parameter support when the built-in OpenRouter provider requests a JSON schema; omit the routing object for other requests. [e95cf16](https://github.com/johnjheejin/Handy/commit/e95cf16aa7140b84d77ec4d7840f7694e9ef8a59) | [Rust tests](https://github.com/cjpais/Handy/actions/runs/39396514091), [nix-build](https://github.com/cjpais/Handy/actions/runs/39396514086) |
| [#2307](https://github.com/cjpais/Handy/pull/2307) | Restore only the failed setting using current state, preserving unrelated updates. [bc9173a](https://github.com/johnjheejin/Handy/commit/bc9173a75606f14d0bef8781b49833e39ad4a24b) | [Playwright](https://github.com/cjpais/Handy/actions/runs/39551872638), [code quality](https://github.com/cjpais/Handy/actions/runs/39551872663), [nix-build](https://github.com/cjpais/Handy/actions/runs/39551872640) |
| [#2308](https://github.com/cjpais/Handy/pull/2308) | Discard obsolete post-processing model-list completions after connection changes and preserve current loading ownership. [a60944b](https://github.com/johnjheejin/Handy/commit/a60944b9f907c68751009c93fa9cc186a7f26ee4) | [Playwright](https://github.com/cjpais/Handy/actions/runs/39565567986), [code quality](https://github.com/cjpais/Handy/actions/runs/39565568013), [nix-build](https://github.com/cjpais/Handy/actions/runs/39565567987) |
| [#2309](https://github.com/cjpais/Handy/pull/2309) | Release audio Blob URLs that finish loading after their History player is removed. [51e19a1](https://github.com/johnjheejin/Handy/commit/51e19a1c2f50ef012de59831e6c8ace2536b8740) | [Playwright](https://github.com/cjpais/Handy/actions/runs/39583412846), [code quality](https://github.com/cjpais/Handy/actions/runs/39583413035), [nix-build](https://github.com/cjpais/Handy/actions/runs/39583412991) |

The submitted changes include request-serialization regression tests (#2300), settings-store rollback coverage (#2307), model-list request-race coverage (#2308), and browser AudioPlayer lifecycle coverage (#2309). These checks do not establish live OpenRouter/provider routing, native desktop behavior, Linux WebKit memory measurements, or assistive-technology testing. The `nix-build` results above identify successful CI jobs; they do not independently establish that a full native compilation ran.

### IME maintenance after the UI refresh

Status checked 2026-10-26: [#2248](https://github.com/cjpais/Handy/pull/2248) is published at [3ab3482](https://github.com/johnjheejin/Handy/commit/3ab34828a3b587be56225fc866df1a166bc62447), including main `73c0958`. The updated PR body documents custom words, recognition/preferred-language pickers and the model table using a shared composition-event guard. [Playwright CI](https://github.com/cjpais/Handy/actions/runs/40306514880) passed 19 committed regressions plus two existing smoke tests (21 total); [code quality](https://github.com/cjpais/Handy/actions/runs/40306515067) and [Nix quick checks](https://github.com/cjpais/Handy/actions/runs/40306514930) also passed. This is existing published evidence, not a new product test run by the ledger.

The browser tests use synthetic composition/keyboard events and a replaced native settings service. Real Windows IME, Tauri WebView2/installed-app behavior, Mac execution and a current production/native build are unverified. The independently reproduced Windows production-bundle termination remains separate from these passing browser checks. Maintainer acceptance is pending.

### Bounded model-download fallback

Status checked 2026-10-26: [#2318](https://github.com/cjpais/Handy/pull/2318) is open at published maintenance head [837cbc7](https://github.com/johnjheejin/Handy/commit/837cbc73596f5a07023ddb46eb0587f601c8b17a). It addresses oversized Hugging Face responses reported in [#2100](https://github.com/cjpais/Handy/issues/2100): stop the current attempt and use the existing bounded, SHA-256-verified mirror, preserving explicit cancellation and main's transfer-rate/resume reporting. Other download-failure causes are outside this claim.

The head passed [Rust CI](https://github.com/cjpais/Handy/actions/runs/40189768508) and [Nix quick checks](https://github.com/cjpais/Handy/actions/runs/40189768509); Nix did not run a full application build. The published PR reports an actual Windows MSVC crate check and 19 selected HF tests using loopback HTTP and synthetic data, with an existing official engine runtime reused rather than compiled locally. This is not the full Rust suite or a current production bundle, live-CDN, GUI, installed-app or Mac validation. Maintainer acceptance remains pending.
