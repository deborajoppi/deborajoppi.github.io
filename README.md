# deborajoppi.github.io

Personal website for Débora Joppi, built with Next.js and deployed to GitHub Pages.

Live site:
- `https://deborajoppi.github.io`

## What is in this repo

The homepage now opens directly into the science section with tabbed navigation.

Main sections:
- `/` - About page with the shared science navigation shell
- `/science/research` - research overview
- `/science/publications` - publications and manuscripts
- `/science/projects` - project index
- `/science/projects/stats` - browser-based stats tool
- `/science/projects/cloneflow` - website project page for CloneFlow, with links to the live app and repo
- `/finance` - client-side personal finance dashboard
- `/tools` - utility landing page for non-homepage tools

Key components:
- `app/components/science-shell.tsx` - shared top-level shell for the tabbed science view
- `app/components/site-mark.tsx` - header monogram/logo
- `app/components/stats-lab.tsx` - stats project UI

## Local development

```bash
npm install
npm run dev
```

Then open:
- `http://localhost:3000`

## Build

```bash
npm run build
```

This repo is configured for static export through Next.js, so production output is written to `out/`.

## Deployment

Primary deployment path:
- push to `main`
- GitHub Actions runs `.github/workflows/pages.yml`
- the workflow builds `out/` and deploys it to GitHub Pages

GitHub Pages settings:
- `Settings -> Pages`
- source: `GitHub Actions`

Manual export snapshot:

```bash
npm run build
npm run deploy
```

That moves `out/` into `docs/`. The live Pages deployment, however, is driven by GitHub Actions from source, not by manually committing `docs/`.

## Related project links

CloneFlow is maintained as a separate repo and app:
- Repo: `https://github.com/deborajoppi/CloneFlow`
- Live app: `https://clone-flow.vercel.app`
