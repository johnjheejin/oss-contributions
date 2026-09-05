# Contributing records

This repository tracks public upstream contributions. It does not mirror upstream source code.

## Add a contribution

1. Add or reuse a public repository entry in `data/contributions.json`.
2. Add the pull request using the stable ID `github:<owner>/<repo>#<number>`.
3. Record only checks that were actually run.
4. Add a project page under `projects/<owner>/<repo>.md` when the upstream is new.
5. Run:

   ```sh
   npm test
   npm run render
   npm run check
   ```

The scheduled workflow also runs `npm run discover`. It searches public pull requests authored by `johnjheejin`, excludes repositories owned by the same account, and fails when an in-scope external pull request has no stable registry record.

Personal work may be excluded from the public ledger with the `DISCOVERY_EXCLUDED_REPOSITORIES` Actions secret (comma- or whitespace-separated upstream `owner/repo` values). Set the same environment variable for local discovery. Excluded names are not stored in the registry or printed by discovery; all other external contributions remain audited.

## Public-data boundary

- Use public GitHub URLs and public repository names only.
- Do not include local paths, credentials, private repository names, internal notes, or unpublished patches.
- Keep detailed implementation work in the contribution fork or upstream pull request.
- Use the optional link file documented in `docs/linking-contract.md` when another public repository needs a durable connection to this hub.
