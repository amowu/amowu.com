# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal website + resume at amowu.com. Two halves in one repo:
- `src/frontend/` — Vue 1.x SPA (Vue Router, Vuex, Semantic UI, Phaser game under `phaser-game/`)
- `src/backend/` — Serverless Framework 0.5.6 Lambda functions (API Gateway + DynamoDB)

Hosted on S3 + CloudFront. Build pipeline: Webpack 1 + Babel (ES2015, stage-2, Flow strip).

## Commands

```bash
npm run dev                # Dev server, hot reload on :8080
npm run build              # Production bundle
npm run unit               # Karma + PhantomJS unit tests
npm run e2e                # Nightwatch/Selenium e2e
npm test                   # unit + e2e
npm run lint               # ESLint over .js and .vue
```

## Stack

Current stack is Vue 1.x, Webpack 1, Node 4.3-era patterns. Match the surrounding code style when editing existing files.

ESLint uses `eslint-config-standard` with `babel-eslint`. `Phaser` is a global. `.vue` files are linted via `eslint-plugin-html`.

## Workflow

- **Gitflow**: `develop` is the integration branch, `main` is production. Branch features off `develop` as `feature/*`. Production fixes go on `hotfix/x.y.z` off `main`, then merge back to both `main` and `develop`.
- **Run `npm run lint` before any commit.** Fix lint issues rather than suppressing them.
- **Never run `npm run deploy:staging` or `npm run deploy:production`.** Deploys are CI-driven on CircleCI: push to `develop` deploys staging, push to `main` deploys production. CircleCI provides `AWS_PROFILE`, `AWS_REGION`, `BUCKET_NAME`, `CLOUDFRONT_DIST_ID`.
