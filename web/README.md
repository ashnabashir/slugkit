# Slug Playground

A browser playground for the `slugkit` slug library. Paste titles, one per
line, tune the separator and maximum length, and copy the slugs or the
matching Python and command-line snippets.

`src/lib/slugify.ts` mirrors `src/slugkit/core.py` from the repository root.
Change both together; `src/lib/slugify.test.ts` uses the same cases as the
Python tests.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev      # http://127.0.0.1:5391
npm test
npm run build    # static output in dist/
```
