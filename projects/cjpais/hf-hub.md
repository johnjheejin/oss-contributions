# cjpais/hf-hub

This is Handy's fork of the Rust client for Hugging Face Hub. Handy uses it to download speech-recognition model files; it is a library dependency, not the Handy application itself.

- Upstream: [cjpais/hf-hub](https://github.com/cjpais/hf-hub), branch `cancellable-downloads`
- Contribution fork: [johnjheejin/hf-hub](https://github.com/johnjheejin/hf-hub)
- Related application: [Handy](Handy.md)
- Public registry: [`data/contributions.json`](../../data/contributions.json)

## Tracked contribution

| Stable ID | Pull request | Status |
|---|---|---|
| `github:cjpais/hf-hub#3` | [Cancel sequential fallback while waiting for headers](https://github.com/cjpais/hf-hub/pull/3) | Open for review |

Published on 2026-11-14 with head [`4cee548`](https://github.com/johnjheejin/hf-hub/commit/4cee548f87cd86a35dc1b769d0e39e86dd731991), targeting `cancellable-downloads`. The public diff changes only `src/api/tokio.rs` and matches the reviewed source. This is a submitted contribution, not a merged change or a release.

## Contribution scope

When a server ignores a ranged download request, the library falls back to a sequential GET. The change makes cancellation observable while that fallback is waiting for response headers, rather than only while reading the response body.

The production change adds a cancellation branch around the request wait. The regression checks that cancellation preserves the resumable partial file and committed-offset marker, does not publish a completed cache entry, and permits a retry using a fresh token.

This is separate from Handy's [download-attempt ownership PR #2357](https://github.com/cjpais/Handy/pull/2357) and [HTTP cancellation-test PR #2339](https://github.com/cjpais/Handy/pull/2339). It does not claim to fix every cancellation phase or to identify which earlier version introduced the behavior.

## Validation boundary

The [public PR](https://github.com/cjpais/hf-hub/pull/3) records the following local results. At the 2026-11-14 05:49 UTC check, the [published head had zero GitHub check runs](https://github.com/cjpais/hf-hub/pull/3/checks) and zero workflow runs. The repository [Actions](https://github.com/cjpais/hf-hub/actions) API listed zero registered workflows and its page reported no workflows found. Hosted CI is **not run**, not passed or failed; a fork-run approval wait was not established. The precise repository configuration needs maintainer confirmation. No workflow was added or enabled by this contribution.

The candidate was prepared against [`fc27355`](https://github.com/cjpais/hf-hub/commit/fc273554a88ce5f5372c84386a9adf535ba71a1c). On Windows with MSVC Rust 1.99.0, its native library regression passed with one test executed and 17 filtered out:

```sh
cargo test --no-default-features --features tokio --locked --offline --lib api::tokio::tests::cancel_while_sequential_fallback_waits_for_headers_preserves_retry -- --exact --nocapture
```

The same regression body failed against the unmodified pin in the focused fixture. Six candidate fixture checks passed, covering cancellation, partial/cache preservation, retry and ownership. These are implementation-validation results reused by this ledger, not tests rerun by the ledger.

Validation used synthetic localhost HTTP only. The full library suite, live Hub, TLS backends, installed Handy application, and Linux/macOS execution were not validated locally. The fixture's cached transitive dependency versions were held equal between the original and fixed variants, but were not identical to every dependency in Handy's lockfile.
