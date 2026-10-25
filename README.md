# Prashant Kumar: personal resume site

Static single-page site built with Astro and Tailwind. Design lives in [docs/SPEC.md](docs/SPEC.md), copy in [docs/CONTENT.md](docs/CONTENT.md).

## Edit the content

All text lives in `src/data/resume.yaml`. The page and the PDF both read it. The build fails if the file has a `phone` or `dob` field or a phone-like number anywhere in the text.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Builds the site, then `dist/Prashant-Kumar-Resume.pdf` (needs Google Chrome) |
| `npm test` | Builds, then runs the content, page and PDF tests (Vitest) |
| `npm run test:e2e` | Builds, serves `dist`, runs the browser tests (Playwright and axe) |
| `node scripts/build-og.mjs` | Regenerates `public/og.png` |

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which tests and then publishes `dist` to GitHub Pages. In the repo settings, set Pages source to "GitHub Actions". The repo must be named `pksingh83.github.io` for the site to live at the root URL.

## To do later

- Add the headshot as `public/headshot.jpg` and use it in `src/components/About.astro` (a "PK" monogram shows until then).
- Attach a custom domain.
