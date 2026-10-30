# Testing

- Tests use Vitest and are named `*.test.ts` or `*.test.tsx`, usually beside the implementation (see `src/components/editor/`).
- Add focused tests for behavior changes.
- Run `pnpm test` to run the Vitest suite once, and `pnpm lint` to check `src/`, `app/`, and `lib/` with ESLint.
- No coverage threshold is configured.
