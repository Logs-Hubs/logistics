# Development Workflow

## Linear integration

- Every coding task delegated from Linear must use the actual Linear issue identifier, such as LOG-14.
- Never invent or substitute the Linear issue ID with the GitHub issue number.
- If the issue identifier is missing or ambiguous, request clarification before preparing the PR.

## Branch conventions

- Use `main` as the base branch.
- Never commit directly to `main`.
- When branch naming is controllable, prefer:
  `codex/<LINEAR-ID>-<short-description>`
- If Codex Cloud generates the branch name automatically, do not assume it contains the issue ID. Ensure the PR title and body identify the issue.

## Commit conventions

Use Conventional Commits when generating commit messages.

Example:
`feat: add user validation (LOG-14)`

## Pull request conventions

- Target branch: `main`.
- Preferred PR state: Draft.
- PR title format:
  `LOG-X: Add user validation`
- Replace LOG-X with the actual Linear issue identifier.
- Include this exact closing reference in the PR description:
  `Fixes LOG-X`
- The PR description must summarize the changes and report tests performed.
- If the platform generates a different PR title or body, flag the mismatch for correction before merge.
- Never merge a pull request autonomously.

## Implementation and validation

- Implement only the scope requested by the Linear issue.
- Add or update automated tests as appropriate.
- Run relevant tests and report their actual results.
- Do not claim tests passed unless they were executed successfully.
- Report any failing or skipped tests.

## Delivery

When finished, report:
1. Linear issue ID.
2. Files changed.
3. Implementation summary.
4. Tests executed and results.
5. Proposed branch name, PR title and PR description.
6. Any limitations or unresolved problems.

Leave final PR publication, review and merge under human control.
