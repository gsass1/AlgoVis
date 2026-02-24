# AGENTS.md

## Cursor Cloud specific instructions

**AlgoVis** is a frontend-only algorithm visualization app (vanilla JS + Vite + Sass). There is no backend, database, or test framework.

### Running the app

- `npm run dev` starts the Vite dev server on **port 9000** (see `vite.config.js`).
- `npm run build` produces a production build in `dist/`.
- See `README.md` for standard commands.

### Notes

- No linter, formatter, or test runner is configured in the project.
- The `js-interpreter` package is deprecated but functional; expect an npm warning on install.
- The Vite alias for `js-interpreter` in `vite.config.js` points to `node_modules/js-interpreter/lib/index.js` — this is required for the import to resolve correctly.
