# lidge-jun/opencodex

OpenCodex is a provider proxy for using Codex and Claude Code with alternative models and OpenAI-compatible gateways.

- Upstream: [lidge-jun/opencodex](https://github.com/lidge-jun/opencodex)
- Contribution fork: [johnjheejin/opencodex](https://github.com/johnjheejin/opencodex)
- Public registry: [`data/contributions.json`](../../data/contributions.json)

## Tracked contribution

| Stable ID | Original pull request | Upstream outcome |
|---|---|---|
| `github:lidge-jun/opencodex#8220` | [#8220](https://github.com/lidge-jun/opencodex/pull/8220), closed without a direct merge | Custom gateway verification guide in English and Korean; [re-land PR #8412 merged](https://github.com/lidge-jun/opencodex/pull/8412) with [co-author credit](https://github.com/lidge-jun/opencodex/commit/d079eccaf283c411880fd425f74a9671d66eab1f) |

The original PR remains the authored record. The merged change adds standalone English and Korean guides and links them from the provider docs. The maintainer's carry and re-land PRs are outcome evidence, not additional authored contributions.

## Landing history

| Date (UTC) | Event | Public evidence |
|---|---|---|
| 2026-11-09 00:38 | Initial carry #8350 merged; the original PR was then closed in its favor | [Initial merge](https://github.com/lidge-jun/opencodex/pull/8350) · [Maintainer attribution](https://github.com/lidge-jun/opencodex/pull/8220#issuecomment-6729481235) |
| 2026-11-09 00:54 | #8402 reverted 14 PRs, including #8350, because the required reviews had not been confirmed before their admin merges | [Batch revert and stated reason](https://github.com/lidge-jun/opencodex/pull/8402) |
| 2026-11-09 01:01 | #8412 re-landed #8350 unchanged after independent review, retaining co-author credit | [Re-land PR](https://github.com/lidge-jun/opencodex/pull/8412) · [Current landing commit](https://github.com/lidge-jun/opencodex/commit/d079eccaf283c411880fd425f74a9671d66eab1f) |

Checked 2026-11-12: the [English guide on dev](https://github.com/lidge-jun/opencodex/blob/dev/docs-site/src/content/docs/guides/custom-gateway.md) is present. The re-land PR cites the original exact-head CI and a subsequent independent PASS review; it explicitly says CI was not run on the re-land head. The batch revert was a review-process correction, not a stated rejection of this guide. This ledger points to #8412 as the latest landing while preserving the initial merge and revert above.

## Scope and validation

The original PR targeted `dev` and was prepared against `650cbc6a340ba2aa9dd579f5229017f12475b90d`. Its final head was `5e9afec645cbfbb1c812622f372474cb728483e9`.

The guide distinguishes saved configuration, proxy health and readiness, model discovery, exact routed model IDs, initial model visibility, and an opt-in completion test. It adds no vendor-specific preset and does not certify a gateway or vendor endpoint.

The [original PR's validation follow-up](https://github.com/lidge-jun/opencodex/pull/8220#issuecomment-6681162303) reports:

- Direct Bun 1.4.4 type checking passed across 2,317 files.
- Model-selection and CLI workflow fixtures: 34 passed, 0 failed, using mocked HTTP.
- Documentation build and Pagefind indexing completed for 641 pages; 93,164 internal links were checked.
- Privacy scanning and diff whitespace checks passed.

These are results for the original PR, not tests rerun by this ledger or results for the maintainer's PR. The full runtime suite was not run. Live gateway access, inference, actual model identity, tool use, structured outputs, and continuation compatibility remain unverified.

[Historical hygiene CI](https://github.com/lidge-jun/opencodex/actions/runs/42169060530) succeeded on the earlier draft head `6f5b6376b22290bfaabb2d9db4a3ab219091e90f`.

## Follow-up boundary

This contribution covers documentation only. Any implementation follow-up first needs a minimal, non-identifying fixture of an observed gateway failure, an explicit protocol and expected result, and a check for overlapping upstream work. Existing setup records alone do not establish a reproduced Responses item-ID or structured-output bug.

Source, validation details, CI and review discussion remain in the upstream PRs and contribution fork. This ledger records public outcomes only.
