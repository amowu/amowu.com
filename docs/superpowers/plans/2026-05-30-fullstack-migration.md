# Fullstack Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Greenfield rewrite the personal website at amowu.com — Vue 1.x + Serverless Framework 0.5.6 + CircleCI → React 19 + Phaser 4 + NestJS + AWS CDK + GitHub Actions — while preserving content (Phaser RPG gameplay, NPC dialogues, resume data) and personality. 

**Architecture:** npm workspaces monorepo (`apps/web`, `apps/api`, `packages/shared`, `infra`). Frontend = Phaser 4 (background, persistent across routes) + React 19 (overlays via TanStack Router) + animal-island-ui (Animal Crossing aesthetic). Backend = NestJS on Lambda Web Adapter (Docker container) + ElectroDB on DynamoDB. Infra = AWS CDK v2 with 4 stacks (oidc / data / api / web). CI/CD = single GitHub Actions workflow `ci-cd.yml` (verify → deploy) with OIDC auth. Zod is the single source of truth for the API contract (in `@amowu/shared`), used by both ends.

**Tech Stack:** React 19, Phaser 4, Vite, TanStack Router (file-based) + Query, animal-island-ui, Tailwind CSS, NestJS (Express platform), ElectroDB, Zod, AWS Lambda + Lambda Web Adapter + Docker, API Gateway HTTP API, DynamoDB, S3, CloudFront, Route53, AWS CDK v2, GitHub Actions + OIDC, Vitest, Playwright, TypeScript 5, Node 22.

**Spec reference:** [`docs/superpowers/specs/2026-05-30-fullstack-migration-design.md`](../specs/2026-05-30-fullstack-migration-design.md). Open the spec alongside this plan — the plan references section numbers (`§3.3`, `§6.2` etc.) when full context lives there.

---

## How to read this plan

- **14 phases**, executed roughly in order. Each phase ends in a green test / working state and a commit. You can stop and resume between phases.
- Inside a phase, **tasks** are the unit of subagent dispatch. Each task lists its files and bite-sized steps.
- **Old code (`src/frontend/`, `src/backend/`) stays in place** through Phases 1-13. Phase 14 (cutover) is when we switch traffic. Old code is deleted in a separate PR after the cutover is verified.
- The work happens on `feature/fullstack-migration` branch (already exists). Branch protection rules from §7.2 are configured in Phase 12 — **before that**, you can push directly to the feature branch normally.

## Sequencing diagram

```
Phase 1 Foundation
       │
       ├─→ Phase 2 shared (Zod schemas)
       │           │
       │           ├──────────────┐
       │           ↓              ↓
       ├─→ Phase 3 api impl     Phase 5 web foundation
       │           │              │
       │           ↓              ├─→ Phase 6 web routing
       │   Phase 4 api Dockerfile │
       │                          ├─→ Phase 7 web resume (needs Phase 3)
       │                          ├─→ Phase 8 web dialogue
       │                          └─→ Phase 9 web Phaser game
       │
       └─→ Phase 10 infra OIDC + data
              │
              ↓
           Phase 11 infra api + web
              │
              ↓
           Phase 12 GitHub Actions ci-cd + branch protection
              │
              ↓
           Phase 13 Data migration (run scripts)
              │
              ↓
           Phase 14 Cutover (runbook, manual)
```

---

## Phase 1: Foundation — monorepo, tooling, docker-compose

**Why:** Everything downstream depends on the monorepo layout, TypeScript base config, lint/format setup, and local DynamoDB container. Get the skeleton right once.

### Task 1.1: Create new directory structure (leave old code in place)

**Files:**
- Create: `apps/web/.gitkeep`
- Create: `apps/api/.gitkeep`
- Create: `packages/shared/.gitkeep`
- Create: `infra/.gitkeep`
- Create: `scripts/.gitkeep`

- [ ] **Step 1: Create directories**

```bash
mkdir -p apps/web apps/api packages/shared infra scripts
touch apps/web/.gitkeep apps/api/.gitkeep packages/shared/.gitkeep infra/.gitkeep scripts/.gitkeep
```

- [ ] **Step 2: Verify old code untouched**

```bash
ls src/frontend/ src/backend/
```
Expected: existing Vue 1.x frontend and Serverless backend still present.

- [ ] **Step 3: Commit**

```bash
git add apps/ packages/ infra/ scripts/
git commit -m "chore: scaffold monorepo directory structure"
```

### Task 1.2: Root `package.json` with npm workspaces

**Files:**
- Modify: `package.json` (existing file, replace contents — old Vue 1.x deps move out)

> Old `package.json` is the Vue 1.x project. We are **replacing** it with a fresh monorepo root. Old deps move into `src/frontend`-specific package.json? **No** — old code does not need to be installable; it stays as static history until cutover. We just need root to not declare the old deps.

- [ ] **Step 1: Back up old `package.json` for reference**

```bash
cp package.json package.json.old-vue1-backup
```

- [ ] **Step 2: Replace `package.json` with monorepo root**

```json
{
  "name": "amowu.com",
  "version": "2.0.0-alpha.0",
  "private": true,
  "description": "Personal website + resume monorepo",
  "workspaces": [
    "apps/*",
    "packages/*",
    "infra"
  ],
  "engines": {
    "node": ">=22"
  },
  "scripts": {
    "lint": "eslint .",
    "typecheck": "npm run typecheck --workspaces --if-present",
    "test": "npm run test --workspaces --if-present",
    "build": "npm run build --workspaces --if-present",
    "dev:api": "npm run dev -w @amowu/api",
    "dev:web": "npm run dev -w @amowu/web",
    "cdk": "npm run cdk -w @amowu/infra"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "eslint": "^9.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "prettier": "^3.3.0",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 3: Add `.nvmrc`**

Create file `.nvmrc`:
```
22
```

- [ ] **Step 4: `npm install` to verify workspaces resolve**

```bash
npm install
```
Expected: completes without errors. `node_modules/` populated.

- [ ] **Step 5: Commit**

```bash
git add package.json package.json.old-vue1-backup package-lock.json .nvmrc
git commit -m "chore: replace root package.json with monorepo workspaces"
```

### Task 1.3: Root TypeScript base config

**Files:**
- Create: `tsconfig.base.json`

- [ ] **Step 1: Write `tsconfig.base.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add tsconfig.base.json
git commit -m "chore: add shared TypeScript base config"
```

### Task 1.4: Root ESLint flat config + Prettier

**Files:**
- Create: `eslint.config.js`
- Create: `.prettierrc.json`
- Create: `.prettierignore`

- [ ] **Step 1: Write `eslint.config.js`**

```js
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'

export default [
  {
    ignores: [
      'src/frontend/**',
      'src/backend/**',
      'dist/**',
      'node_modules/**',
      'cdk.out/**',
      '*.old-vue1-backup',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
    plugins: { '@typescript-eslint': tseslint },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]
```

Note: old `src/frontend/` and `src/backend/` are explicitly ignored — they are pre-modern code we do not lint.

- [ ] **Step 2: Write `.prettierrc.json`**

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

- [ ] **Step 3: Write `.prettierignore`**

```
src/frontend/
src/backend/
dist/
node_modules/
cdk.out/
*.old-vue1-backup
```

- [ ] **Step 4: Run lint on empty repo**

```bash
npx eslint .
```
Expected: no errors (nothing to lint yet; just confirms config valid).

- [ ] **Step 5: Commit**

```bash
git add eslint.config.js .prettierrc.json .prettierignore
git commit -m "chore: add ESLint flat config and Prettier"
```

### Task 1.5: Docker Compose for local DynamoDB

**Files:**
- Create: `docker-compose.yml`

- [ ] **Step 1: Write `docker-compose.yml`**

```yaml
services:
  dynamodb:
    image: amazon/dynamodb-local:latest
    container_name: amowu-dynamodb
    ports:
      - "8000:8000"
    command: -jar DynamoDBLocal.jar -sharedDb -dbPath /data
    volumes:
      - dynamodb-data:/data

volumes:
  dynamodb-data:
```

- [ ] **Step 2: Smoke test — start container, verify port open**

```bash
docker compose up -d dynamodb
sleep 3
curl -s http://localhost:8000/
docker compose stop dynamodb
```
Expected: `curl` returns a non-empty response (DynamoDB Local responds with a redirect or info page). No errors from `docker compose`.

- [ ] **Step 3: Commit**

```bash
git add docker-compose.yml
git commit -m "chore: add docker-compose for local DynamoDB"
```

### Task 1.6: Update `.gitignore` for new artifacts

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Read current `.gitignore` and append new entries**

Add to bottom of `.gitignore`:

```
# Monorepo build outputs
apps/*/dist/
apps/*/.next/
packages/*/dist/
infra/cdk.out/

# DynamoDB local data
dynamodb-data/

# IDE
.vscode/
.idea/

# Vite
**/.vite/
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: gitignore monorepo build outputs"
```

### Task 1.7: Phase 1 verification

- [ ] **Step 1: Run lint + verify directories**

```bash
npm run lint
ls -la apps/ packages/ infra/ scripts/
docker compose up -d dynamodb && sleep 2 && docker compose stop dynamodb
```
Expected: lint passes (nothing to check), all directories exist, DDB Local starts and stops cleanly.

- [ ] **Step 2: Phase 1 final commit (if any uncommitted)**

```bash
git status
```
If clean, Phase 1 is done. Move to Phase 2.

---

## Phase 2: `@amowu/shared` — Zod schemas (API contract)

**Why:** Both `@amowu/api` (validates response) and `@amowu/web` (validates fetched response) depend on this. Build it first so downstream workspaces can import.

**Files for Phase 2:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/index.ts`
- Create: `packages/shared/src/resume.schema.ts`
- Create: `packages/shared/tests/resume.schema.spec.ts`
- Create: `packages/shared/vitest.config.ts`

### Task 2.1: Package skeleton

- [ ] **Step 1: Write `packages/shared/package.json`**

```json
{
  "name": "@amowu/shared",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "vitest": "^2.0.0"
  }
}
```

> Note: `main` points to source `.ts` — consumers in this monorepo use TypeScript path resolution. No build step needed for shared. We intentionally omit `"type": "module"` because consumers (`@amowu/api` is commonjs, `@amowu/web` is ESM) compile this source themselves under their own module setting.

- [ ] **Step 2: Write `packages/shared/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*", "tests/**/*"]
}
```

- [ ] **Step 3: Write `packages/shared/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
})
```

- [ ] **Step 4: Install workspace deps**

```bash
npm install
```

- [ ] **Step 5: Commit**

```bash
git add packages/shared/ package-lock.json
git commit -m "feat(shared): add package skeleton"
```

### Task 2.2: Resume schema — TDD

- [ ] **Step 1: Write failing test `packages/shared/tests/resume.schema.spec.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { ResumeSchema, type Resume } from '../src/resume.schema'

describe('ResumeSchema', () => {
  const valid: Resume = {
    id: 'amowu',
    name: 'Amo Wu',
    email: 'amowu@hahow.in',
    experiences: [
      {
        company: 'Hahow',
        title: 'Software Engineer',
        startDate: '2020-01',
        description: 'Built things.',
      },
    ],
    skills: ['TypeScript', 'React', 'AWS'],
  }

  it('accepts a valid resume', () => {
    expect(() => ResumeSchema.parse(valid)).not.toThrow()
  })

  it('rejects missing required field', () => {
    const { id: _, ...invalid } = valid
    expect(() => ResumeSchema.parse(invalid)).toThrow()
  })

  it('treats description as optional', () => {
    const noDesc = {
      ...valid,
      experiences: [{ company: 'X', title: 'Y', startDate: '2020-01' }],
    }
    expect(() => ResumeSchema.parse(noDesc)).not.toThrow()
  })

  it('rejects experiences missing required fields', () => {
    const badExp = { ...valid, experiences: [{ company: 'X' }] }
    expect(() => ResumeSchema.parse(badExp)).toThrow()
  })
})
```

- [ ] **Step 2: Run test, confirm failure**

```bash
npm run test -w @amowu/shared
```
Expected: FAIL — module `../src/resume.schema` does not exist.

- [ ] **Step 3: Implement `packages/shared/src/resume.schema.ts`**

```ts
import { z } from 'zod'

export const ExperienceSchema = z.object({
  company: z.string(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  description: z.string().optional(),
})

export type Experience = z.infer<typeof ExperienceSchema>

export const ResumeSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  experiences: z.array(ExperienceSchema),
  skills: z.array(z.string()),
})

export type Resume = z.infer<typeof ResumeSchema>
```

- [ ] **Step 4: Write `packages/shared/src/index.ts`**

```ts
export * from './resume.schema'
```

- [ ] **Step 5: Run tests, confirm pass**

```bash
npm run test -w @amowu/shared
```
Expected: PASS (4 tests).

- [ ] **Step 6: Run typecheck**

```bash
npm run typecheck -w @amowu/shared
```
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add packages/shared/src/ packages/shared/tests/
git commit -m "feat(shared): add ResumeSchema with Zod"
```

> **Note**: Real resume data from the migration script may have additional fields (Phase 13). When that happens, update `ResumeSchema` and add corresponding tests. For now this skeleton schema is sufficient.

---

## Phase 3: `@amowu/api` — NestJS + ElectroDB + local DDB + endpoint

**Why:** Standing up a working API endpoint (`GET /api/resume` reading from local DynamoDB) unblocks frontend work. We TDD where logic is non-trivial (service mapping), and treat scaffolding (Nest CLI bootstrap, Docker) as atomic setup tasks.

### Task 3.1: NestJS workspace skeleton

**Files:**
- Create: `apps/api/package.json`
- Create: `apps/api/tsconfig.json`
- Create: `apps/api/tsconfig.build.json`
- Create: `apps/api/nest-cli.json`
- Create: `apps/api/src/main.ts`
- Create: `apps/api/src/app.module.ts`

- [ ] **Step 1: Write `apps/api/package.json`**

```json
{
  "name": "@amowu/api",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "build": "nest build",
    "predev": "docker compose -f ../../docker-compose.yml up -d dynamodb && npm run ddb:reset",
    "dev": "nest start --watch",
    "start": "node dist/main.js",
    "lint": "eslint src --ext .ts",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "ddb:init": "tsx scripts/init-local-ddb.ts",
    "ddb:seed": "tsx scripts/seed-local-ddb.ts",
    "ddb:reset": "npm run ddb:init && npm run ddb:seed"
  },
  "dependencies": {
    "@amowu/shared": "*",
    "@aws-sdk/client-dynamodb": "^3.654.0",
    "@aws-sdk/util-dynamodb": "^3.654.0",
    "@nestjs/common": "^10.4.0",
    "@nestjs/core": "^10.4.0",
    "@nestjs/platform-express": "^10.4.0",
    "electrodb": "^3.1.0",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.4.0",
    "@nestjs/testing": "^10.4.0",
    "@types/express": "^5.0.0",
    "tsx": "^4.19.0",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 2: Write `apps/api/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2022",
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "outDir": "dist",
    "rootDir": "src",
    "baseUrl": ".",
    "paths": {
      "@amowu/shared": ["../../packages/shared/src/index.ts"]
    }
  },
  "include": ["src/**/*", "tests/**/*", "scripts/**/*"]
}
```

> Note: `module: commonjs` is required by NestJS DI. Different from `@amowu/shared` which is ESM. Paths alias lets us import `@amowu/shared` directly from source.

- [ ] **Step 3: Write `apps/api/tsconfig.build.json`**

```json
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "tests", "dist", "scripts"]
}
```

- [ ] **Step 4: Write `apps/api/nest-cli.json`**

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
```

- [ ] **Step 5: Write `apps/api/src/main.ts`**

```ts
import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.enableCors({ origin: process.env.CORS_ORIGIN ?? '*' })
  const port = process.env.PORT ?? 8080
  await app.listen(port)
  console.log(`API listening on http://localhost:${port}/api`)
}

bootstrap()
```

- [ ] **Step 6: Write minimal `apps/api/src/app.module.ts`** (we'll add ResumeModule in Task 3.4)

```ts
import { Module } from '@nestjs/common'

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

- [ ] **Step 7: Install workspace deps**

```bash
npm install
```

- [ ] **Step 8: Smoke test — Nest can boot empty**

```bash
npm run build -w @amowu/api
node apps/api/dist/main.js &
sleep 2
curl -sf http://localhost:8080/api && echo "ok" || echo "expected 404 ok"
kill %1
```
Expected: Nest boots; `curl` returns 404 (no routes registered yet) which is fine.

- [ ] **Step 9: Commit**

```bash
git add apps/api/ package-lock.json
git commit -m "feat(api): scaffold NestJS workspace"
```

### Task 3.2: Config module with Zod env validation

**Files:**
- Create: `apps/api/src/config/env.schema.ts`
- Create: `apps/api/src/config/config.module.ts`
- Create: `apps/api/src/config/config.service.ts`
- Create: `apps/api/tests/config.spec.ts`

- [ ] **Step 1: Write failing test `apps/api/tests/config.spec.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { EnvSchema } from '../src/config/env.schema'

describe('EnvSchema', () => {
  const valid = {
    PORT: '8080',
    AWS_REGION: 'us-east-1',
    DDB_TABLE_NAME: 'resume-local',
    CORS_ORIGIN: 'http://localhost:5173',
  }

  it('parses valid env', () => {
    expect(() => EnvSchema.parse(valid)).not.toThrow()
  })

  it('coerces PORT to number', () => {
    const parsed = EnvSchema.parse(valid)
    expect(parsed.PORT).toBe(8080)
  })

  it('allows optional DDB_ENDPOINT', () => {
    const withEndpoint = { ...valid, DDB_ENDPOINT: 'http://localhost:8000' }
    const parsed = EnvSchema.parse(withEndpoint)
    expect(parsed.DDB_ENDPOINT).toBe('http://localhost:8000')
  })

  it('rejects missing required field', () => {
    const { AWS_REGION: _, ...invalid } = valid
    expect(() => EnvSchema.parse(invalid)).toThrow()
  })
})
```

- [ ] **Step 2: Add vitest config `apps/api/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@amowu/shared': '../../packages/shared/src/index.ts',
    },
  },
})
```

- [ ] **Step 3: Run test, confirm failure**

```bash
npm run test -w @amowu/api
```
Expected: FAIL — `EnvSchema` not exported.

- [ ] **Step 4: Implement `apps/api/src/config/env.schema.ts`**

```ts
import { z } from 'zod'

export const EnvSchema = z.object({
  PORT: z.coerce.number().default(8080),
  AWS_REGION: z.string(),
  DDB_TABLE_NAME: z.string(),
  DDB_ENDPOINT: z.string().url().optional(),
  CORS_ORIGIN: z.string(),
})

export type Env = z.infer<typeof EnvSchema>
```

- [ ] **Step 5: Run test, confirm pass**

```bash
npm run test -w @amowu/api
```
Expected: PASS (4 tests).

- [ ] **Step 6: Implement `apps/api/src/config/config.service.ts`**

```ts
import { Injectable } from '@nestjs/common'
import { EnvSchema, type Env } from './env.schema'

@Injectable()
export class AppConfigService {
  readonly env: Env

  constructor() {
    this.env = EnvSchema.parse(process.env)
  }

  get(key: keyof Env): Env[keyof Env] {
    return this.env[key]
  }
}
```

- [ ] **Step 7: Implement `apps/api/src/config/config.module.ts`**

```ts
import { Global, Module } from '@nestjs/common'
import { AppConfigService } from './config.service'

@Global()
@Module({
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class ConfigModule {}
```

- [ ] **Step 8: Wire into `AppModule`**

Modify `apps/api/src/app.module.ts`:

```ts
import { Module } from '@nestjs/common'
import { ConfigModule } from './config/config.module'

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

- [ ] **Step 9: Smoke test — boot fails clearly when env missing**

```bash
PORT=8080 AWS_REGION=us-east-1 DDB_TABLE_NAME=test CORS_ORIGIN=http://localhost npm run build -w @amowu/api && node apps/api/dist/main.js &
sleep 2 && kill %1
```
Expected: boots without env error. Try unsetting one env var — should crash with Zod error message naming the missing field.

- [ ] **Step 10: Commit**

```bash
git add apps/api/
git commit -m "feat(api): add config module with Zod env validation"
```

### Task 3.3: DynamoDB client provider

**Files:**
- Create: `apps/api/src/infra/dynamodb/dynamodb.module.ts`
- Create: `apps/api/src/infra/dynamodb/dynamodb.tokens.ts`

- [ ] **Step 1: Write `apps/api/src/infra/dynamodb/dynamodb.tokens.ts`**

```ts
export const DDB_CLIENT = Symbol('DDB_CLIENT')
```

- [ ] **Step 2: Write `apps/api/src/infra/dynamodb/dynamodb.module.ts`**

```ts
import { Global, Module } from '@nestjs/common'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { AppConfigService } from '../../config/config.service'
import { DDB_CLIENT } from './dynamodb.tokens'

@Global()
@Module({
  providers: [
    {
      provide: DDB_CLIENT,
      useFactory: (config: AppConfigService) => {
        const region = config.get('AWS_REGION') as string
        const endpoint = config.env.DDB_ENDPOINT
        return new DynamoDBClient({
          region,
          ...(endpoint ? { endpoint } : {}),
        })
      },
      inject: [AppConfigService],
    },
  ],
  exports: [DDB_CLIENT],
})
export class DynamoDBModule {}
```

- [ ] **Step 3: Wire into `AppModule`**

Modify `apps/api/src/app.module.ts`:

```ts
import { Module } from '@nestjs/common'
import { ConfigModule } from './config/config.module'
import { DynamoDBModule } from './infra/dynamodb/dynamodb.module'

@Module({
  imports: [ConfigModule, DynamoDBModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

- [ ] **Step 4: Verify build**

```bash
npm run build -w @amowu/api
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/infra/ apps/api/src/app.module.ts
git commit -m "feat(api): add DynamoDB client provider"
```

### Task 3.4: Resume ElectroDB Entity

**Files:**
- Create: `apps/api/src/resume/resume.entity.ts`
- Create: `apps/api/tests/resume.entity.spec.ts`

- [ ] **Step 1: Write failing test `apps/api/tests/resume.entity.spec.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { makeResumeEntity } from '../src/resume/resume.entity'

describe('ResumeEntity', () => {
  it('creates entity with primary index on id', () => {
    const client = new DynamoDBClient({ region: 'us-east-1' })
    const entity = makeResumeEntity({ client, tableName: 'test' })
    expect(entity.schema.indexes.primary.pk.composite).toContain('id')
  })

  it('has required attributes', () => {
    const client = new DynamoDBClient({ region: 'us-east-1' })
    const entity = makeResumeEntity({ client, tableName: 'test' })
    expect(entity.schema.attributes).toHaveProperty('id')
    expect(entity.schema.attributes).toHaveProperty('name')
    expect(entity.schema.attributes).toHaveProperty('experiences')
    expect(entity.schema.attributes).toHaveProperty('skills')
  })
})
```

- [ ] **Step 2: Run test, confirm failure**

```bash
npm run test -w @amowu/api -- resume.entity
```
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement `apps/api/src/resume/resume.entity.ts`**

```ts
import { Entity } from 'electrodb'
import type { DynamoDBClient } from '@aws-sdk/client-dynamodb'

export function makeResumeEntity(opts: { client: DynamoDBClient; tableName: string }) {
  return new Entity(
    {
      model: { entity: 'resume', service: 'amowu', version: '1' },
      attributes: {
        id: { type: 'string', required: true },
        name: { type: 'string', required: true },
        email: { type: 'string', required: true },
        experiences: {
          type: 'list',
          items: {
            type: 'map',
            properties: {
              company: { type: 'string', required: true },
              title: { type: 'string', required: true },
              startDate: { type: 'string', required: true },
              endDate: { type: 'string' },
              description: { type: 'string' },
            },
          },
        },
        skills: { type: 'list', items: { type: 'string' } },
        version: { type: 'number', default: 1 },
        updatedAt: { type: 'string', default: () => new Date().toISOString() },
      },
      indexes: {
        primary: {
          pk: { field: 'pk', composite: ['id'] },
          sk: { field: 'sk', composite: [] },
        },
      },
    },
    { table: opts.tableName, client: opts.client },
  )
}

export type ResumeEntity = ReturnType<typeof makeResumeEntity>
```

- [ ] **Step 4: Run test, confirm pass**

```bash
npm run test -w @amowu/api -- resume.entity
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/resume/resume.entity.ts apps/api/tests/resume.entity.spec.ts
git commit -m "feat(api): add ElectroDB Resume entity"
```

### Task 3.5: Resume repository

**Files:**
- Create: `apps/api/src/resume/resume.repository.ts`
- Create: `apps/api/tests/resume.repository.spec.ts`

> The repository is the DB-only layer. It returns raw ElectroDB items (DB shape) without mapping. Service does the API contract mapping (Task 3.6).

- [ ] **Step 1: Write failing test `apps/api/tests/resume.repository.spec.ts`**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Test } from '@nestjs/testing'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { ResumeRepository } from '../src/resume/resume.repository'
import { DDB_CLIENT } from '../src/infra/dynamodb/dynamodb.tokens'
import { AppConfigService } from '../src/config/config.service'

describe('ResumeRepository', () => {
  let repo: ResumeRepository

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ResumeRepository,
        { provide: DDB_CLIENT, useValue: new DynamoDBClient({ region: 'us-east-1' }) },
        { provide: AppConfigService, useValue: { env: { DDB_TABLE_NAME: 'test' } } },
      ],
    }).compile()
    repo = moduleRef.get(ResumeRepository)
  })

  it('exposes a findOne method', () => {
    expect(typeof repo.findOne).toBe('function')
  })

  it('findOne calls ElectroDB get with id', async () => {
    const spy = vi.spyOn(repo['entity'], 'get').mockReturnValue({
      go: async () => ({ data: { id: 'amowu', name: 'A', email: 'a@b.c', experiences: [], skills: [] } }),
    } as never)
    const result = await repo.findOne('amowu')
    expect(spy).toHaveBeenCalledWith({ id: 'amowu' })
    expect(result?.id).toBe('amowu')
  })

  it('findOne returns null when not found', async () => {
    vi.spyOn(repo['entity'], 'get').mockReturnValue({
      go: async () => ({ data: null }),
    } as never)
    const result = await repo.findOne('nonexistent')
    expect(result).toBeNull()
  })
})
```

- [ ] **Step 2: Run test, confirm failure**

```bash
npm run test -w @amowu/api -- resume.repository
```
Expected: FAIL.

- [ ] **Step 3: Implement `apps/api/src/resume/resume.repository.ts`**

```ts
import { Inject, Injectable } from '@nestjs/common'
import type { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DDB_CLIENT } from '../infra/dynamodb/dynamodb.tokens'
import { AppConfigService } from '../config/config.service'
import { makeResumeEntity, type ResumeEntity } from './resume.entity'

@Injectable()
export class ResumeRepository {
  private readonly entity: ResumeEntity

  constructor(
    @Inject(DDB_CLIENT) client: DynamoDBClient,
    config: AppConfigService,
  ) {
    this.entity = makeResumeEntity({
      client,
      tableName: config.env.DDB_TABLE_NAME,
    })
  }

  async findOne(id: string) {
    const { data } = await this.entity.get({ id }).go()
    return data ?? null
  }
}
```

- [ ] **Step 4: Run test, confirm pass**

```bash
npm run test -w @amowu/api -- resume.repository
```
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/resume/resume.repository.ts apps/api/tests/resume.repository.spec.ts
git commit -m "feat(api): add Resume repository"
```

### Task 3.6: Resume service (DB → API mapping + Zod parse)

**Files:**
- Create: `apps/api/src/resume/resume.service.ts`
- Create: `apps/api/tests/resume.service.spec.ts`

- [ ] **Step 1: Write failing test `apps/api/tests/resume.service.spec.ts`**

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { Test } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { ResumeService } from '../src/resume/resume.service'
import { ResumeRepository } from '../src/resume/resume.repository'

describe('ResumeService', () => {
  let service: ResumeService
  let repo: { findOne: ReturnType<typeof vi.fn> }

  beforeEach(async () => {
    repo = { findOne: vi.fn() }
    const moduleRef = await Test.createTestingModule({
      providers: [
        ResumeService,
        { provide: ResumeRepository, useValue: repo },
      ],
    }).compile()
    service = moduleRef.get(ResumeService)
  })

  it('maps DB shape to API contract', async () => {
    repo.findOne.mockResolvedValue({
      id: 'amowu',
      name: 'Amo',
      email: 'a@b.c',
      experiences: [],
      skills: [],
      version: 1,                  // DB-only field
      updatedAt: '2026-05-30',     // DB-only field
    })
    const result = await service.findOne('amowu')
    expect(result).toEqual({
      id: 'amowu',
      name: 'Amo',
      email: 'a@b.c',
      experiences: [],
      skills: [],
    })
    expect(result).not.toHaveProperty('version')
    expect(result).not.toHaveProperty('updatedAt')
  })

  it('throws NotFoundException when repo returns null', async () => {
    repo.findOne.mockResolvedValue(null)
    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException)
  })

  it('validates DB data against ResumeSchema (rejects malformed email)', async () => {
    repo.findOne.mockResolvedValue({
      id: 'amowu',
      name: 'Amo',
      email: 'not-an-email',
      experiences: [],
      skills: [],
    })
    await expect(service.findOne('amowu')).rejects.toThrow()
  })
})
```

> The test imports `vi` from vitest globals. Add to test file top if needed: `import { vi } from 'vitest'`.

- [ ] **Step 2: Run test, confirm failure**

```bash
npm run test -w @amowu/api -- resume.service
```
Expected: FAIL.

- [ ] **Step 3: Implement `apps/api/src/resume/resume.service.ts`**

```ts
import { Injectable, NotFoundException } from '@nestjs/common'
import { ResumeSchema, type Resume } from '@amowu/shared'
import { ResumeRepository } from './resume.repository'

@Injectable()
export class ResumeService {
  constructor(private readonly repo: ResumeRepository) {}

  async findOne(id: string): Promise<Resume> {
    const item = await this.repo.findOne(id)
    if (!item) throw new NotFoundException(`Resume ${id} not found`)
    return ResumeSchema.parse({
      id: item.id,
      name: item.name,
      email: item.email,
      experiences: item.experiences,
      skills: item.skills,
    })
  }
}
```

- [ ] **Step 4: Run test, confirm pass**

```bash
npm run test -w @amowu/api -- resume.service
```
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/resume/resume.service.ts apps/api/tests/resume.service.spec.ts
git commit -m "feat(api): add Resume service with DB-to-API mapping"
```

### Task 3.7: Resume controller + module + wire into AppModule

**Files:**
- Create: `apps/api/src/resume/resume.controller.ts`
- Create: `apps/api/src/resume/resume.module.ts`
- Modify: `apps/api/src/app.module.ts`

- [ ] **Step 1: Write `apps/api/src/resume/resume.controller.ts`**

```ts
import { Controller, Get, Param } from '@nestjs/common'
import type { Resume } from '@amowu/shared'
import { ResumeService } from './resume.service'

@Controller('resume')
export class ResumeController {
  constructor(private readonly service: ResumeService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Resume> {
    return this.service.findOne(id)
  }

  @Get()
  findDefault(): Promise<Resume> {
    return this.service.findOne('amowu')
  }
}
```

- [ ] **Step 2: Write `apps/api/src/resume/resume.module.ts`**

```ts
import { Module } from '@nestjs/common'
import { ResumeController } from './resume.controller'
import { ResumeService } from './resume.service'
import { ResumeRepository } from './resume.repository'

@Module({
  controllers: [ResumeController],
  providers: [ResumeService, ResumeRepository],
})
export class ResumeModule {}
```

- [ ] **Step 3: Update `apps/api/src/app.module.ts`**

```ts
import { Module } from '@nestjs/common'
import { ConfigModule } from './config/config.module'
import { DynamoDBModule } from './infra/dynamodb/dynamodb.module'
import { ResumeModule } from './resume/resume.module'

@Module({
  imports: [ConfigModule, DynamoDBModule, ResumeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

- [ ] **Step 4: Build + smoke test**

```bash
npm run build -w @amowu/api
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/resume/ apps/api/src/app.module.ts
git commit -m "feat(api): wire ResumeModule into app"
```

### Task 3.8: Local DynamoDB init + seed scripts

**Files:**
- Create: `apps/api/scripts/init-local-ddb.ts`
- Create: `apps/api/scripts/seed-local-ddb.ts`
- Create: `apps/api/seeds/resume.json` (placeholder sample data)

- [ ] **Step 1: Write `apps/api/seeds/resume.json`** (placeholder; real data comes in Phase 13)

```json
[
  {
    "id": "amowu",
    "name": "Amo Wu",
    "email": "amowu@hahow.in",
    "experiences": [
      {
        "company": "Hahow",
        "title": "Software Engineer",
        "startDate": "2020-01",
        "description": "Placeholder; replaced by real data in Phase 13."
      }
    ],
    "skills": ["TypeScript", "React", "AWS"]
  }
]
```

- [ ] **Step 2: Write `apps/api/scripts/init-local-ddb.ts`**

```ts
import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
  ResourceNotFoundException,
} from '@aws-sdk/client-dynamodb'

const TABLE_NAME = process.env.DDB_TABLE_NAME ?? 'resume-local'
const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  credentials: { accessKeyId: 'local', secretAccessKey: 'local' },
})

async function tableExists() {
  try {
    await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }))
    return true
  } catch (e) {
    if (e instanceof ResourceNotFoundException) return false
    throw e
  }
}

async function main() {
  if (await tableExists()) {
    console.log(`Table ${TABLE_NAME} already exists; skipping create.`)
    return
  }
  await client.send(
    new CreateTableCommand({
      TableName: TABLE_NAME,
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
        { AttributeName: 'sk', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'sk', AttributeType: 'S' },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    }),
  )
  console.log(`Created table ${TABLE_NAME}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
```

- [ ] **Step 3: Write `apps/api/scripts/seed-local-ddb.ts`**

```ts
import { readFile } from 'node:fs/promises'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { makeResumeEntity } from '../src/resume/resume.entity'

const TABLE_NAME = process.env.DDB_TABLE_NAME ?? 'resume-local'
const SEED_FILE = new URL('../seeds/resume.json', import.meta.url)

async function main() {
  const client = new DynamoDBClient({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000',
    credentials: { accessKeyId: 'local', secretAccessKey: 'local' },
  })
  const entity = makeResumeEntity({ client, tableName: TABLE_NAME })
  const raw = await readFile(SEED_FILE, 'utf-8')
  const items = JSON.parse(raw)
  for (const item of items) {
    await entity.put(item).go()
    console.log(`Seeded resume ${item.id}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
```

- [ ] **Step 4: Smoke test end-to-end**

```bash
# Start DDB Local
docker compose up -d dynamodb
sleep 3

# Init + seed
cd apps/api
DDB_TABLE_NAME=resume-local npm run ddb:init
DDB_TABLE_NAME=resume-local npm run ddb:seed
cd ../..

# Run Nest dev (in foreground briefly)
PORT=8080 AWS_REGION=us-east-1 DDB_TABLE_NAME=resume-local \
  DDB_ENDPOINT=http://localhost:8000 \
  CORS_ORIGIN=http://localhost:5173 \
  AWS_ACCESS_KEY_ID=local AWS_SECRET_ACCESS_KEY=local \
  npm run start -w @amowu/api &
sleep 3

# Test endpoint
curl -s http://localhost:8080/api/resume | jq .

# Cleanup
kill %1
docker compose stop dynamodb
```
Expected: `curl` returns the placeholder resume JSON. No errors.

- [ ] **Step 5: Commit**

```bash
git add apps/api/scripts/ apps/api/seeds/
git commit -m "feat(api): add local DDB init + seed scripts"
```

### Task 3.9: Phase 3 wrap-up — `predev` integration

- [ ] **Step 1: Test `predev` hook end-to-end**

```bash
docker compose down
PORT=8080 AWS_REGION=us-east-1 DDB_TABLE_NAME=resume-local \
  DDB_ENDPOINT=http://localhost:8000 \
  CORS_ORIGIN=http://localhost:5173 \
  AWS_ACCESS_KEY_ID=local AWS_SECRET_ACCESS_KEY=local \
  npm run dev -w @amowu/api &
sleep 6
curl -s http://localhost:8080/api/resume
kill %1
docker compose stop dynamodb
```
Expected: single `npm run dev` brings up DDB, initializes table, seeds, starts Nest, and the endpoint works.

- [ ] **Step 2: If smoke test passed, no commit needed (no new files)**

---

## Phase 4: `@amowu/api` — Dockerfile (Lambda Web Adapter)

**Why:** CDK `DockerImageFunction` will build from this Dockerfile (Phase 11). Validating it stands alone locally avoids debugging during deploy.

### Task 4.1: Dockerfile + .dockerignore

**Files:**
- Create: `apps/api/Dockerfile`
- Create: `apps/api/.dockerignore`

- [ ] **Step 1: Write `apps/api/.dockerignore`**

```
node_modules
dist
tests
scripts
seeds
*.spec.ts
.git
.env*
```

- [ ] **Step 2: Write `apps/api/Dockerfile`** (spec §4.3)

```dockerfile
# syntax=docker/dockerfile:1.7

FROM public.ecr.aws/lambda/nodejs:22 AS deps
WORKDIR /tmp
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
RUN npm ci --omit=dev --workspaces --include-workspace-root

FROM public.ecr.aws/lambda/nodejs:22 AS build
WORKDIR /build
COPY --from=deps /tmp/node_modules ./node_modules
COPY tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api
WORKDIR /build/apps/api
RUN npx nest build

FROM public.ecr.aws/lambda/nodejs:22
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 \
     /lambda-adapter /opt/extensions/lambda-adapter
ENV PORT=8080
ENV AWS_LWA_INVOKE_MODE=response_stream
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=deps /tmp/node_modules ./node_modules
COPY --from=deps /tmp/packages/shared ./packages/shared
COPY --from=build /build/apps/api/dist ./
CMD ["main.js"]
```

> Note: This is a multi-stage build that respects the monorepo layout. CDK builds the image with the repo root as context (Phase 11). The `--include-workspace-root` flag is critical for npm workspaces in Docker.

- [ ] **Step 3: Smoke test — build image locally**

```bash
docker build -f apps/api/Dockerfile -t amowu-api:local .
```
Expected: Docker build succeeds. Image roughly 200-300 MB.

- [ ] **Step 4: Smoke test — run container, hit endpoint**

The LWA container expects to be invoked via Lambda runtime API, not HTTP directly. We use `aws-lambda-runtime-interface-emulator` (RIE) for local testing.

```bash
# Pull the RIE-enabled Lambda runtime emulator (bundled with public.ecr.aws image)
docker run --rm -p 9000:8080 \
  -e AWS_REGION=us-east-1 \
  -e DDB_TABLE_NAME=resume-local \
  -e CORS_ORIGIN=* \
  -e AWS_ACCESS_KEY_ID=local \
  -e AWS_SECRET_ACCESS_KEY=local \
  amowu-api:local &
sleep 3

# Invoke through RIE
curl -s -XPOST http://localhost:9000/2015-03-31/functions/function/invocations \
  -d '{"requestContext":{"http":{"method":"GET","path":"/api/resume"}},"rawPath":"/api/resume","rawQueryString":"","headers":{},"isBase64Encoded":false}' | jq .

kill %1
```
Expected: response includes a 404 or 500 (DDB Local is not reachable from this container yet). The key is that the container **starts**, LWA is loaded, Nest boots, and a request is processed. Errors about DDB are expected at this stage.

- [ ] **Step 5: Commit**

```bash
git add apps/api/Dockerfile apps/api/.dockerignore
git commit -m "feat(api): add LWA Dockerfile"
```

---

## Phase 5: `@amowu/web` foundation — template + workspace + libs + Tailwind + fonts

**Why:** Get the frontend workspace booting on Vite with all the dependencies we'll need. Subsequent web phases add routing, features, dialogue, and Phaser scenes on top.

### Task 5.1: Copy template-react-ts content into `apps/web/`

**Files:**
- Create: many files from `phaserjs/template-react-ts`

- [ ] **Step 1: Clone template into a temp dir, copy contents into `apps/web/`**

```bash
cd /tmp
git clone --depth 1 https://github.com/phaserjs/template-react-ts.git
cp -r template-react-ts/{index.html,public,src,vite,tsconfig.json,tsconfig.node.json} /Users/amowu/Documents/Personal/amowu.com/apps/web/
cd /Users/amowu/Documents/Personal/amowu.com
rm -rf /tmp/template-react-ts
```

- [ ] **Step 2: Remove template `.eslintrc.cjs` and other root-level files we don't want at workspace level**

Check `apps/web/` and remove if present:
```bash
rm -f apps/web/.eslintrc.cjs apps/web/.gitignore apps/web/package-lock.json
```

- [ ] **Step 3: Replace `apps/web/package.json` with workspace-compatible version**

```json
{
  "name": "@amowu/web",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --config vite/config.dev.mjs",
    "build": "tsc -b && vite build --config vite/config.prod.mjs",
    "preview": "vite preview --config vite/config.prod.mjs",
    "lint": "eslint src --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@amowu/shared": "*",
    "@fontsource/noto-sans-tc": "^5.1.0",
    "@tanstack/react-query": "^5.59.0",
    "@tanstack/react-router": "^1.66.0",
    "animal-island-ui": "0.9.4",
    "phaser": "4.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@tanstack/router-plugin": "^1.66.0",
    "@testing-library/react": "^16.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.0",
    "vite": "^5.4.0",
    "vitest": "^2.0.0"
  }
}
```

> `animal-island-ui` is pinned to `0.9.4` (no caret) per spec §11 — pre-1.0 library risk mitigation.

- [ ] **Step 4: Update `apps/web/tsconfig.json` to extend base + add @amowu/shared path**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "noEmit": true,
    "allowImportingTsExtensions": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@amowu/shared": ["../../packages/shared/src/index.ts"]
    }
  },
  "include": ["src", "tests"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 5: Install**

```bash
npm install
```

- [ ] **Step 6: Smoke test — Vite dev server boots**

```bash
npm run dev -w @amowu/web &
sleep 3
curl -sf http://localhost:8080/ -o /dev/null && echo "ok"
kill %1
```
Expected: template's default Phaser+React page reachable at port 8080 (Vite default; we'll change port later if it clashes with API).

> The template uses Vite default port 5173 by default. If your API also defaults to 8080, set the web port via vite config in next step.

- [ ] **Step 7: Set explicit Vite port to 5173 in `apps/web/vite/config.dev.mjs`**

Read existing `apps/web/vite/config.dev.mjs`. It already uses 5173 in template default; verify with:

```bash
grep -A 2 'server' apps/web/vite/config.dev.mjs || true
```

If `server.port` is not set or different, edit to add `server: { port: 5173 }`. The full config from template (after edit) should look roughly like:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
```

> The `/api` proxy is critical: dev frontend at 5173 forwards `/api/*` to dev API at 8080.

- [ ] **Step 8: Commit**

```bash
git add apps/web/ package-lock.json
git commit -m "feat(web): scaffold workspace from phaserjs/template-react-ts"
```

### Task 5.2: Install TanStack Router file-based routing plugin

**Files:**
- Modify: `apps/web/vite/config.dev.mjs`
- Modify: `apps/web/vite/config.prod.mjs`

- [ ] **Step 1: Update both vite configs to include `@tanstack/router-plugin`**

`apps/web/vite/config.dev.mjs`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
  ],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:8080' },
  },
})
```

`apps/web/vite/config.prod.mjs`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
  ],
  build: {
    outDir: 'dist',
  },
})
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/vite/
git commit -m "feat(web): add TanStack Router Vite plugin"
```

### Task 5.3: Tailwind CSS setup

**Files:**
- Create: `apps/web/tailwind.config.js`
- Create: `apps/web/postcss.config.js`
- Create: `apps/web/src/styles/globals.css`

- [ ] **Step 1: Write `apps/web/tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

- [ ] **Step 2: Write `apps/web/postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 3: Write `apps/web/src/styles/globals.css`** (spec §3.3)

```css
/* animal-island-ui bundles Nunito + Zen Maru Gothic + Noto Sans SC */
@import 'animal-island-ui/style';
/* Add only Noto Sans TC (Traditional Chinese) ourselves */
@import '@fontsource/noto-sans-tc/400.css';
@import '@fontsource/noto-sans-tc/700.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

body,
button,
input,
.ai-modal,
.ai-card {
  font-family: 'Nunito', 'Zen Maru Gothic', 'Noto Sans TC', sans-serif;
}

html,
body,
#app {
  height: 100%;
  margin: 0;
}
```

- [ ] **Step 4: Import `globals.css` from `apps/web/src/main.tsx`**

Read existing `apps/web/src/main.tsx`. Add at top:

```ts
import './styles/globals.css'
```

(Other imports from template stay.)

- [ ] **Step 5: Smoke test**

```bash
npm run dev -w @amowu/web &
sleep 3
curl -sf http://localhost:5173/ | grep -i "phaser" >/dev/null && echo "template page reachable"
kill %1
```
Expected: template page still serves; CSS loads (no console errors in browser if opened manually).

- [ ] **Step 6: Commit**

```bash
git add apps/web/tailwind.config.js apps/web/postcss.config.js apps/web/src/styles/ apps/web/src/main.tsx
git commit -m "feat(web): add Tailwind + fonts + animal-island-ui styles"
```

---

## Phase 6: `@amowu/web` routing — `__root.tsx` with persistent PhaserGame

**Why:** Set up the architectural backbone: Phaser canvas lives in root layout (persistent across routes); pages are overlays via `<Outlet />`.

### Task 6.1: TanStack Router scaffold + persistent PhaserGame

**Files:**
- Create: `apps/web/src/routes/__root.tsx`
- Create: `apps/web/src/routes/index.tsx`
- Create: `apps/web/src/routes/resume.tsx`
- Modify: `apps/web/src/App.tsx`
- Modify: `apps/web/src/main.tsx`
- Create: `apps/web/src/lib/queryClient.ts`

- [ ] **Step 1: Write `apps/web/src/lib/queryClient.ts`**

```ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
})
```

- [ ] **Step 2: Write `apps/web/src/routes/__root.tsx`**

```tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { PhaserGame } from '../PhaserGame'
import { DialogueOverlay } from '../features/dialogue/DialogueOverlay'

export const Route = createRootRoute({
  component: () => (
    <>
      <PhaserGame />
      <main className="absolute inset-0 pointer-events-none">
        <div className="pointer-events-auto">
          <Outlet />
        </div>
      </main>
      <DialogueOverlay />
    </>
  ),
})
```

> `pointer-events-none` on the overlay layer lets clicks pass through to Phaser by default; route content opts back in with `pointer-events-auto`.

- [ ] **Step 3: Write placeholder `apps/web/src/routes/index.tsx`**

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => null,
})
```

The home route renders nothing — just background Phaser game shows.

- [ ] **Step 4: Write placeholder `apps/web/src/routes/resume.tsx`**

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/resume')({
  component: () => (
    <div className="p-8 bg-white/80 m-8 rounded-2xl">
      <h1 className="text-2xl">Resume (placeholder)</h1>
    </div>
  ),
})
```

- [ ] **Step 5: Write placeholder `apps/web/src/features/dialogue/DialogueOverlay.tsx`**

```tsx
export function DialogueOverlay() {
  return null
}
```

> Will be implemented in Phase 8.

- [ ] **Step 6: Rewrite `apps/web/src/App.tsx`**

```tsx
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { routeTree } from './routeTree.gen'
import { queryClient } from './lib/queryClient'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
```

- [ ] **Step 7: Update `apps/web/src/main.tsx`**

```tsx
import './styles/globals.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 8: Run dev server, verify routes work**

```bash
npm run dev -w @amowu/web &
sleep 5
curl -sf http://localhost:5173/ -o /dev/null && echo "/ ok"
curl -sf http://localhost:5173/resume -o /dev/null && echo "/resume ok"
kill %1
```
Expected: both routes return 200. TanStack Router plugin generates `apps/web/src/routeTree.gen.ts` automatically on dev — verify file exists.

- [ ] **Step 9: Commit**

```bash
git add apps/web/src/
git commit -m "feat(web): set up TanStack Router with persistent Phaser background"
```

---

## Phase 7: `@amowu/web` resume feature (talks to API)

**Why:** First end-to-end vertical slice: fetch from API + Zod parse + render. Validates `@amowu/shared` integration and CORS/proxy setup.

**Prerequisite:** Phase 3 done (API running locally).

### Task 7.1: API client + useResume hook (TDD)

**Files:**
- Create: `apps/web/src/lib/api-client.ts`
- Create: `apps/web/src/features/resume/useResume.ts`
- Create: `apps/web/tests/useResume.spec.ts`

- [ ] **Step 1: Write `apps/web/src/lib/api-client.ts`**

```ts
import type { ZodSchema } from 'zod'

export async function apiFetch<T>(path: string, schema: ZodSchema<T>): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`${path} returned ${res.status}`)
  const json = await res.json()
  return schema.parse(json)
}
```

- [ ] **Step 2: Write failing test `apps/web/tests/useResume.spec.ts`**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useResume } from '../src/features/resume/useResume'

const wrapper = ({ children }: { children: ReactNode }) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

describe('useResume', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 'amowu',
        name: 'Amo',
        email: 'a@b.c',
        experiences: [],
        skills: [],
      }),
    })
  })

  it('fetches and returns a Resume', async () => {
    const { result } = renderHook(() => useResume(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.name).toBe('Amo')
  })
})
```

Add `apps/web/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@amowu/shared': '../../packages/shared/src/index.ts',
    },
  },
})
```

- [ ] **Step 3: Run test, confirm failure**

```bash
npm run test -w @amowu/web -- useResume
```
Expected: FAIL — module not found.

- [ ] **Step 4: Implement `apps/web/src/features/resume/useResume.ts`**

```ts
import { useQuery } from '@tanstack/react-query'
import { ResumeSchema } from '@amowu/shared'
import { apiFetch } from '../../lib/api-client'

export function useResume(id: string = 'amowu') {
  return useQuery({
    queryKey: ['resume', id],
    queryFn: () => apiFetch(`/api/resume/${id}`, ResumeSchema),
  })
}
```

- [ ] **Step 5: Run test, confirm pass**

```bash
npm run test -w @amowu/web -- useResume
```
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/lib/ apps/web/src/features/resume/ apps/web/tests/ apps/web/vitest.config.ts
git commit -m "feat(web): add API client + useResume hook"
```

### Task 7.2: ResumePage + ResumeCard

**Files:**
- Create: `apps/web/src/features/resume/ResumePage.tsx`
- Create: `apps/web/src/features/resume/ResumeCard.tsx`
- Modify: `apps/web/src/routes/resume.tsx`

- [ ] **Step 1: Write `apps/web/src/features/resume/ResumeCard.tsx`**

```tsx
import type { Resume } from '@amowu/shared'
import { Card } from 'animal-island-ui'

export function ResumeCard({ resume }: { resume: Resume }) {
  return (
    <Card color="app-cream">
      <h1 className="text-2xl font-bold mb-2">{resume.name}</h1>
      <p className="text-sm mb-4">{resume.email}</p>

      <h2 className="text-lg font-bold mt-4 mb-2">Experiences</h2>
      <ul className="space-y-2">
        {resume.experiences.map((exp, i) => (
          <li key={i} className="border-l-2 border-amber-400 pl-3">
            <div className="font-semibold">{exp.title} @ {exp.company}</div>
            <div className="text-xs text-gray-600">
              {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}
            </div>
            {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
          </li>
        ))}
      </ul>

      <h2 className="text-lg font-bold mt-4 mb-2">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {resume.skills.map((s) => (
          <span key={s} className="px-2 py-1 bg-amber-100 rounded text-sm">{s}</span>
        ))}
      </div>
    </Card>
  )
}
```

> Card prop `color="app-cream"` is a guess based on animal-island-ui README — verify against actual API once installed. If different, adjust.

- [ ] **Step 2: Write `apps/web/src/features/resume/ResumePage.tsx`**

```tsx
import { useResume } from './useResume'
import { ResumeCard } from './ResumeCard'

export function ResumePage() {
  const { data, isLoading, isError, error } = useResume()

  if (isLoading) return <div className="p-8">Loading...</div>
  if (isError) return <div className="p-8 text-red-700">Error: {String(error)}</div>
  if (!data) return null

  return (
    <div className="m-8 max-w-2xl">
      <ResumeCard resume={data} />
    </div>
  )
}
```

- [ ] **Step 3: Update `apps/web/src/routes/resume.tsx`**

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { ResumePage } from '../features/resume/ResumePage'

export const Route = createFileRoute('/resume')({
  component: ResumePage,
})
```

- [ ] **Step 4: End-to-end smoke test (API + web together)**

In two terminals:
```bash
# Terminal 1: API
docker compose up -d dynamodb
PORT=8080 AWS_REGION=us-east-1 DDB_TABLE_NAME=resume-local \
  DDB_ENDPOINT=http://localhost:8000 \
  CORS_ORIGIN=http://localhost:5173 \
  AWS_ACCESS_KEY_ID=local AWS_SECRET_ACCESS_KEY=local \
  npm run dev -w @amowu/api

# Terminal 2: web
npm run dev -w @amowu/web
```

Open `http://localhost:5173/resume` in a browser. Expected: ResumeCard renders with placeholder data from seed.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/resume/ apps/web/src/routes/resume.tsx
git commit -m "feat(web): add ResumePage + ResumeCard"
```

---

## Phase 8: `@amowu/web` dialogue system (FSM + EventBus + type-safe tree)

**Why:** Core UX of the site. Reimplements `pages/DialoguePage.vue` + Vuex `dialogues` actions as a clean state machine + EventBus boundary with Phaser.

### Task 8.1: Dialogue types

**Files:**
- Create: `apps/web/src/features/dialogue/types.ts`

- [ ] **Step 1: Write `apps/web/src/features/dialogue/types.ts`**

```ts
export type DialogueNext =
  | { kind: 'dialogue'; id: DialogueId }
  | { kind: 'route'; to: '/' | '/resume' }
  | { kind: 'url'; href: string }
  | { kind: 'options'; items: ReadonlyArray<{ label: string; next: DialogueNext }> }
  | { kind: 'close' }

export type DialogueNode = { text: string; next: DialogueNext }

// Imported by dialogues.ts; circular but type-only so it works
export type DialogueId = string  // narrowed to keyof DialogueTree in dialogues.ts
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/features/dialogue/types.ts
git commit -m "feat(dialogue): add types"
```

### Task 8.2: Port old dialogue tree

**Files:**
- Create: `apps/web/src/features/dialogue/dialogues.ts`

> Old dialogues live in `src/frontend/actions/dialogues.js` and possibly in a Vuex store. The implementer must read the old data and port it. For now, write a representative skeleton; Phase 13 verification will catch missing entries.

- [ ] **Step 1: Read old dialogue data**

```bash
cat src/frontend/actions/dialogues.js
ls src/frontend/components/Dialogue/ 2>/dev/null
grep -r "dialogues" src/frontend/core 2>/dev/null | head
```

> Note what dialogue IDs exist, what options they have, where they route. You'll be transcribing this content.

- [ ] **Step 2: Write `apps/web/src/features/dialogue/dialogues.ts`**

```ts
import type { DialogueNode } from './types'

export const dialogues = {
  npc_amo_intro: {
    text: '嗨，我是 Amo。要看看我的履歷嗎？',
    next: {
      kind: 'options',
      items: [
        { label: '好啊',  next: { kind: 'route', to: '/resume' } },
        { label: 'GitHub', next: { kind: 'url', href: 'https://github.com/amowu' } },
        { label: '掰',    next: { kind: 'close' } },
      ],
    },
  },
  // Add more entries by porting from src/frontend/actions/dialogues.js
} as const satisfies Record<string, DialogueNode>

export type DialogueId = keyof typeof dialogues
```

- [ ] **Step 3: Tighten `DialogueNext` in `types.ts` to use the real `DialogueId`**

Update `apps/web/src/features/dialogue/types.ts`:

```ts
import type { DialogueId } from './dialogues'

export type DialogueNext =
  | { kind: 'dialogue'; id: DialogueId }
  | { kind: 'route'; to: '/' | '/resume' }
  | { kind: 'url'; href: string }
  | { kind: 'options'; items: ReadonlyArray<{ label: string; next: DialogueNext }> }
  | { kind: 'close' }

export type DialogueNode = { text: string; next: DialogueNext }
```

> Circular type-only import is fine for TS.

- [ ] **Step 4: Typecheck**

```bash
npm run typecheck -w @amowu/web
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/dialogue/
git commit -m "feat(dialogue): port dialogue tree (initial entries)"
```

### Task 8.3: Dialogue state machine (useReducer FSM) — TDD

**Files:**
- Create: `apps/web/src/features/dialogue/useDialogueMachine.ts`
- Create: `apps/web/tests/useDialogueMachine.spec.ts`

- [ ] **Step 1: Write failing test `apps/web/tests/useDialogueMachine.spec.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDialogueMachine } from '../src/features/dialogue/useDialogueMachine'

describe('useDialogueMachine', () => {
  it('starts in idle state', () => {
    const { result } = renderHook(() => useDialogueMachine())
    expect(result.current.state.status).toBe('idle')
  })

  it('open transitions to typing with the requested dialogue', () => {
    const { result } = renderHook(() => useDialogueMachine())
    act(() => result.current.open('npc_amo_intro'))
    expect(result.current.state.status).toBe('typing')
    expect(result.current.state.activeId).toBe('npc_amo_intro')
  })

  it('typeEnd transitions to waitingOption (when node has options)', () => {
    const { result } = renderHook(() => useDialogueMachine())
    act(() => result.current.open('npc_amo_intro'))
    act(() => result.current.typeEnd())
    expect(result.current.state.status).toBe('waitingOption')
  })

  it('close returns to idle', () => {
    const { result } = renderHook(() => useDialogueMachine())
    act(() => result.current.open('npc_amo_intro'))
    act(() => result.current.close())
    expect(result.current.state.status).toBe('idle')
    expect(result.current.state.activeId).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run test, confirm failure**

```bash
npm run test -w @amowu/web -- useDialogueMachine
```
Expected: FAIL.

- [ ] **Step 3: Implement `apps/web/src/features/dialogue/useDialogueMachine.ts`**

```ts
import { useReducer, useCallback } from 'react'
import { dialogues, type DialogueId } from './dialogues'

type State =
  | { status: 'idle'; activeId?: undefined }
  | { status: 'typing'; activeId: DialogueId }
  | { status: 'waitingOption'; activeId: DialogueId }
  | { status: 'waitingNext'; activeId: DialogueId }

type Action =
  | { type: 'open'; id: DialogueId }
  | { type: 'typeEnd' }
  | { type: 'advance'; nextId: DialogueId }
  | { type: 'close' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'open':
      return { status: 'typing', activeId: action.id }
    case 'typeEnd': {
      if (state.status !== 'typing') return state
      const node = dialogues[state.activeId]
      const isOptions = node.next.kind === 'options'
      return {
        status: isOptions ? 'waitingOption' : 'waitingNext',
        activeId: state.activeId,
      }
    }
    case 'advance':
      return { status: 'typing', activeId: action.nextId }
    case 'close':
      return { status: 'idle' }
  }
}

export function useDialogueMachine() {
  const [state, dispatch] = useReducer(reducer, { status: 'idle' } as State)
  const open = useCallback((id: DialogueId) => dispatch({ type: 'open', id }), [])
  const typeEnd = useCallback(() => dispatch({ type: 'typeEnd' }), [])
  const advance = useCallback((nextId: DialogueId) => dispatch({ type: 'advance', nextId }), [])
  const close = useCallback(() => dispatch({ type: 'close' }), [])
  return { state, open, typeEnd, advance, close }
}
```

- [ ] **Step 4: Run test, confirm pass**

```bash
npm run test -w @amowu/web -- useDialogueMachine
```
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/dialogue/useDialogueMachine.ts apps/web/tests/useDialogueMachine.spec.ts
git commit -m "feat(dialogue): add FSM with useReducer"
```

### Task 8.4: DialogueBox + DialogueOptions + DialogueOverlay components

**Files:**
- Create: `apps/web/src/features/dialogue/DialogueBox.tsx`
- Create: `apps/web/src/features/dialogue/DialogueOptions.tsx`
- Modify: `apps/web/src/features/dialogue/DialogueOverlay.tsx`

- [ ] **Step 1: Write `apps/web/src/features/dialogue/DialogueBox.tsx`**

```tsx
import { Modal, Typewriter } from 'animal-island-ui'

type Props = {
  open: boolean
  text: string
  onTypeEnd: () => void
  children?: React.ReactNode
  onClose: () => void
}

export function DialogueBox({ open, text, onTypeEnd, children, onClose }: Props) {
  return (
    <Modal open={open} onClose={onClose}>
      <Typewriter text={text} speed={30} onEnd={onTypeEnd} />
      {children}
    </Modal>
  )
}
```

> Verify `Modal` and `Typewriter` props match animal-island-ui's actual API. Adjust prop names if README shows differently.

- [ ] **Step 2: Write `apps/web/src/features/dialogue/DialogueOptions.tsx`**

```tsx
import { Button } from 'animal-island-ui'
import type { DialogueNext } from './types'

type Props = {
  items: ReadonlyArray<{ label: string; next: DialogueNext }>
  onSelect: (next: DialogueNext) => void
}

export function DialogueOptions({ items, onSelect }: Props) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {items.map((opt) => (
        <Button key={opt.label} type="primary" onClick={() => onSelect(opt.next)}>
          {opt.label}
        </Button>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Implement `apps/web/src/features/dialogue/DialogueOverlay.tsx`**

```tsx
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { EventBus } from '../../game/EventBus'
import { dialogues, type DialogueId } from './dialogues'
import { useDialogueMachine } from './useDialogueMachine'
import { DialogueBox } from './DialogueBox'
import { DialogueOptions } from './DialogueOptions'
import type { DialogueNext } from './types'

export function DialogueOverlay() {
  const { state, open, typeEnd, advance, close } = useDialogueMachine()
  const navigate = useNavigate()

  // Subscribe to Phaser EventBus
  useEffect(() => {
    const handler = (id: DialogueId) => open(id)
    EventBus.on('dialogue:open', handler)
    return () => {
      EventBus.off('dialogue:open', handler)
    }
  }, [open])

  // Pause/resume game on open/close
  useEffect(() => {
    if (state.status === 'idle') {
      EventBus.emit('game:resume')
    } else {
      EventBus.emit('game:pause')
    }
  }, [state.status])

  function handleNext(next: DialogueNext) {
    switch (next.kind) {
      case 'dialogue':
        advance(next.id)
        break
      case 'route':
        navigate({ to: next.to })
        close()
        break
      case 'url':
        window.open(next.href, '_blank', 'noopener,noreferrer')
        close()
        break
      case 'close':
        close()
        break
      case 'options':
        // Should not reach here — options handled via DialogueOptions
        break
    }
  }

  if (state.status === 'idle') return null

  const node = dialogues[state.activeId]

  return (
    <DialogueBox
      open={state.status !== 'idle'}
      text={node.text}
      onTypeEnd={typeEnd}
      onClose={close}
    >
      {state.status === 'waitingOption' && node.next.kind === 'options' && (
        <DialogueOptions items={node.next.items} onSelect={handleNext} />
      )}
      {state.status === 'waitingNext' && (
        <div className="mt-4 text-right text-sm text-gray-500">點擊以繼續…</div>
      )}
    </DialogueBox>
  )
}
```

> `EventBus` import — the template provides `apps/web/src/game/EventBus.ts`. Verify the path matches.

- [ ] **Step 4: Smoke test (no NPC triggers yet — just verify build)**

```bash
npm run typecheck -w @amowu/web
npm run build -w @amowu/web
```
Expected: clean build.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/features/dialogue/
git commit -m "feat(dialogue): add DialogueOverlay with EventBus boundary"
```

---

## Phase 9: `@amowu/web` Phaser game rewrite (assets + scenes)

**Why:** This is the largest creative chunk — the old Phaser 2 game must be reimagined in Phaser 4. Scenes are rewritten; assets are reused. The implementer should treat each scene as its own task.

> **Scope guidance:** The plan provides the scaffolding and integration points (asset paths, scene structure, EventBus emissions for NPC triggers). The actual gameplay logic — tilemap collision, player movement, NPC spawn positions, camera follow — is reconstructed from observation of the old game. Allocate 2-3 days here.

### Task 9.1: Copy assets from old phaser-game to public/assets

**Files:**
- Create: `apps/web/public/assets/**` (copied from `src/frontend/phaser-game/`)

- [ ] **Step 1: Inspect old assets**

```bash
find src/frontend/phaser-game -type f \( -name '*.png' -o -name '*.jpg' -o -name '*.json' -o -name '*.mp3' -o -name '*.ogg' \) | head -40
```

- [ ] **Step 2: Copy to public/assets, preserving subdirs**

```bash
mkdir -p apps/web/public/assets
# Copy images, tilemaps, audio — adjust patterns as needed
find src/frontend/phaser-game -type f \
  \( -name '*.png' -o -name '*.jpg' -o -name '*.json' -o -name '*.mp3' -o -name '*.ogg' \) \
  -exec cp --parents {} apps/web/public/assets/ \;
```

> On macOS, `cp --parents` is not available — use `rsync -R src/frontend/phaser-game/foo.png apps/web/public/assets/` per file, or rewrite to a small node script.

Simpler approach on macOS:

```bash
mkdir -p apps/web/public/assets/phaser-game
cp -R src/frontend/phaser-game/{tilemaps,sprites,audio,*.png,*.json} apps/web/public/assets/phaser-game/ 2>/dev/null || true
ls apps/web/public/assets/phaser-game/
```

(Adjust based on what `find` revealed in Step 1.)

- [ ] **Step 3: Verify in Vite dev server**

```bash
npm run dev -w @amowu/web &
sleep 3
curl -sI http://localhost:5173/assets/phaser-game/tilemaps/world.json 2>/dev/null | head -1 || true
kill %1
```
Expected: 200 for any sampled asset. (Substitute a real filename from your tree.)

- [ ] **Step 4: Commit**

```bash
git add apps/web/public/assets/
git commit -m "feat(web): copy Phaser game assets from old project"
```

### Task 9.2: Phaser game config + Boot/Preloader scenes

**Files:**
- Modify: `apps/web/src/game/main.ts` (template-provided)
- Modify: `apps/web/src/game/scenes/Boot.ts`
- Modify: `apps/web/src/game/scenes/Preloader.ts`
- Delete: `apps/web/src/game/scenes/MainMenu.ts`, `Game.ts`, `GameOver.ts` (template demos)
- Create: `apps/web/src/game/scenes/WorldScene.ts`

- [ ] **Step 1: Inspect template files**

```bash
cat apps/web/src/game/main.ts
ls apps/web/src/game/scenes/
```

- [ ] **Step 2: Delete template demo scenes**

```bash
rm apps/web/src/game/scenes/MainMenu.ts apps/web/src/game/scenes/Game.ts apps/web/src/game/scenes/GameOver.ts
```

- [ ] **Step 3: Update `apps/web/src/game/main.ts`**

```ts
import * as Phaser from 'phaser'
import { Boot } from './scenes/Boot'
import { Preloader } from './scenes/Preloader'
import { WorldScene } from './scenes/WorldScene'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: window.innerWidth,
  height: window.innerHeight,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 0 }, debug: false },
  },
  scene: [Boot, Preloader, WorldScene],
}

export function startGame(parentEl: HTMLElement) {
  return new Phaser.Game({ ...config, parent: parentEl })
}
```

- [ ] **Step 4: Update `apps/web/src/game/scenes/Boot.ts`**

```ts
import * as Phaser from 'phaser'

export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot')
  }

  preload() {
    // Bootstrap loading screen assets (logo, progress bar bg, etc.)
    // this.load.image('logo', 'assets/logo.png')
  }

  create() {
    this.scene.start('Preloader')
  }
}
```

- [ ] **Step 5: Update `apps/web/src/game/scenes/Preloader.ts`**

```ts
import * as Phaser from 'phaser'

export class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader')
  }

  preload() {
    this.load.setPath('assets/phaser-game/')
    // Replace with real asset filenames from src/frontend/phaser-game/
    // Examples:
    // this.load.tilemapTiledJSON('world', 'tilemaps/world.json')
    // this.load.image('tiles', 'tilesets/world.png')
    // this.load.spritesheet('player', 'sprites/player.png', { frameWidth: 32, frameHeight: 32 })
  }

  create() {
    this.scene.start('WorldScene')
  }
}
```

- [ ] **Step 6: Create `apps/web/src/game/scenes/WorldScene.ts` skeleton**

```ts
import * as Phaser from 'phaser'
import { EventBus } from '../EventBus'

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super('WorldScene')
  }

  create() {
    // Tilemap setup (uncomment after real assets loaded)
    // const map = this.make.tilemap({ key: 'world' })
    // const tiles = map.addTilesetImage('tileset_name', 'tiles')
    // const ground = map.createLayer('Ground', tiles!, 0, 0)
    // ground?.setCollisionByProperty({ collides: true })

    // Player (uncomment after real assets loaded)
    // this.player = this.physics.add.sprite(100, 100, 'player')
    // this.cursors = this.input.keyboard!.createCursorKeys()

    // NPC trigger zones — example
    // const npc = this.physics.add.staticImage(200, 200, 'npc')
    // this.physics.add.overlap(this.player, npc, () => {
    //   EventBus.emit('dialogue:open', 'npc_amo_intro')
    // })

    // EventBus listeners for game pause/resume from React
    EventBus.on('game:pause', () => this.scene.pause())
    EventBus.on('game:resume', () => this.scene.resume())

    // Notify React: scene ready
    EventBus.emit('scene:ready', this)
  }

  update() {
    if (!this.player || !this.cursors) return

    const speed = 160
    this.player.setVelocity(0)
    if (this.cursors.left.isDown) this.player.setVelocityX(-speed)
    if (this.cursors.right.isDown) this.player.setVelocityX(speed)
    if (this.cursors.up.isDown) this.player.setVelocityY(-speed)
    if (this.cursors.down.isDown) this.player.setVelocityY(speed)
  }
}
```

> This is a skeleton. Reconstruct the real game logic by reading `src/frontend/phaser-game/states/` and `src/frontend/phaser-game/prefabs/`. The structure here (Boot → Preloader → WorldScene + EventBus integration) is correct; the contents (asset names, tilemap keys, NPC positions, dialogue triggers) come from observation of the old game.

- [ ] **Step 7: Smoke test — game boots without runtime errors**

```bash
npm run dev -w @amowu/web &
sleep 3
# Open http://localhost:5173/ in a browser
# Expected: black/empty canvas (no real assets loaded), no console errors
kill %1
```

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/game/
git commit -m "feat(web): replace template demo scenes with skeleton"
```

### Task 9.3: Reconstruct game logic from old code

> This task is a **review and translation exercise** rather than mechanical implementation. The implementer reads `src/frontend/phaser-game/` line-by-line and writes equivalent Phaser 4 code. Allocate dedicated time.

- [ ] **Step 1: Inventory old game code**

```bash
find src/frontend/phaser-game -type f -name '*.js' | xargs wc -l
```

Read each file and document:
- What scenes exist and what they do
- What entities (player, NPCs, items, doors)
- What tilemap layers and properties
- What dialogue trigger conditions exist
- What music/sound effects play when

- [ ] **Step 2: Load real assets in `Preloader.ts`**

Update with actual asset paths found in Task 9.1.

- [ ] **Step 3: Implement tilemap + collisions in `WorldScene.create`**

- [ ] **Step 4: Implement player sprite + movement**

- [ ] **Step 5: Implement NPC entities with `dialogue:open` emissions on interaction**

Each NPC should `EventBus.emit('dialogue:open', '<dialogue-id>')` when triggered (via overlap or key press). The dialogue IDs must match keys in `apps/web/src/features/dialogue/dialogues.ts`.

- [ ] **Step 6: Manual end-to-end test**

```bash
# Both API and web running
npm run dev -w @amowu/web &
sleep 3
# Open browser, walk player to NPC, verify dialogue overlay appears
kill %1
```

- [ ] **Step 7: Commit (granularly as scenes get fleshed out)**

```bash
git commit -m "feat(web): reconstruct Phaser game logic from old code"
```

(Multiple commits encouraged here — one per scene or major feature.)

### Task 9.4: PhaserGame React wrapper integration

**Files:**
- Modify: `apps/web/src/PhaserGame.tsx` (template-provided)

- [ ] **Step 1: Verify template's PhaserGame.tsx imports `startGame` from `./game/main`**

Read `apps/web/src/PhaserGame.tsx`. If it does its own Phaser.Game construction, replace with calling `startGame(parentEl)` from `./game/main`.

Likely structure (template provides similar):

```tsx
import { useEffect, useRef } from 'react'
import { startGame } from './game/main'
import type * as Phaser from 'phaser'

export function PhaserGame() {
  const containerRef = useRef<HTMLDivElement>(null)
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    gameRef.current = startGame(containerRef.current)
    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0" id="game-container" />
}
```

- [ ] **Step 2: Smoke test full integration**

```bash
npm run dev -w @amowu/web
# Open browser
# Verify: Phaser canvas full screen, /resume overlay readable on top
```

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/PhaserGame.tsx
git commit -m "feat(web): wire PhaserGame component to game/main"
```

---

## Phase 10: `@amowu/infra` — OIDC + data stacks

**Why:** OIDC stack is bootstrap-only (deployed once locally before CI takes over). Data stack creates the prod DynamoDB table that subsequent deploys depend on.

### Task 10.1: CDK workspace skeleton

**Files:**
- Create: `infra/package.json`
- Create: `infra/cdk.json`
- Create: `infra/tsconfig.json`
- Create: `infra/bin/app.ts`
- Create: `infra/lib/config/env.ts`

- [ ] **Step 1: Write `infra/package.json`**

```json
{
  "name": "@amowu/infra",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "build": "tsc",
    "cdk": "cdk",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --ext .ts",
    "test": "vitest run"
  },
  "dependencies": {
    "aws-cdk-lib": "^2.160.0",
    "constructs": "^10.4.0"
  },
  "devDependencies": {
    "aws-cdk": "^2.160.0",
    "tsx": "^4.19.0",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 2: Write `infra/cdk.json`**

```json
{
  "app": "npx tsx bin/app.ts",
  "watch": {
    "include": ["**"],
    "exclude": ["README.md", "cdk*.json", "**/*.d.ts", "**/*.js", "tsconfig.json", "package*.json", "node_modules"]
  },
  "context": {
    "@aws-cdk/aws-iam:standardizedServicePrincipals": true,
    "@aws-cdk/aws-cloudfront:s3OriginAccessControlByDefault": true
  }
}
```

- [ ] **Step 3: Write `infra/tsconfig.json`**

```json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2022",
    "moduleResolution": "node",
    "noEmit": false,
    "outDir": "dist",
    "rootDir": "."
  },
  "include": ["bin/**/*", "lib/**/*"]
}
```

- [ ] **Step 4: Write `infra/lib/config/env.ts`**

```ts
export const config = {
  account: process.env.CDK_DEFAULT_ACCOUNT ?? '',     // filled in at deploy time
  region: 'us-east-1',
  domain: {
    apex: 'amowu.com',
    www: 'www.amowu.com',
    hostedZoneName: 'amowu.com',
  },
  certificateArn: '',     // TODO: fill in from existing ACM cert (deploy-time value, see spec §10)
  github: {
    owner: 'amowu',
    repo: 'amowu.com',
  },
  tableName: 'resume-prod',
  bucketName: 'amowu-com-prod-web',
}
```

> The `certificateArn` and `account` are deploy-time values per spec §10. Document this in a comment.

- [ ] **Step 5: Write `infra/bin/app.ts` (stub)**

```ts
import 'reflect-metadata'
import { App } from 'aws-cdk-lib'
import { config } from '../lib/config/env'

const app = new App()
const env = { account: config.account, region: config.region }

// Stacks instantiated in subsequent tasks
// new GithubOidcStack(app, 'GithubOidcStack', { env })
// new DataStack(app, 'DataStack', { env })
// new ApiStack(app, 'ApiStack', { env })
// new WebStack(app, 'WebStack', { env })
```

- [ ] **Step 6: Install**

```bash
npm install
```

- [ ] **Step 7: Verify CDK CLI works**

```bash
cd infra && npx cdk --version && cd ..
```

- [ ] **Step 8: Commit**

```bash
git add infra/ package-lock.json
git commit -m "feat(infra): scaffold CDK workspace"
```

### Task 10.2: GitHub OIDC stack

**Files:**
- Create: `infra/lib/stacks/github-oidc-stack.ts`
- Modify: `infra/bin/app.ts`

- [ ] **Step 1: Write `infra/lib/stacks/github-oidc-stack.ts`** (spec §6.2)

```ts
import { Stack, type StackProps, CfnOutput } from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import type { Construct } from 'constructs'
import { config } from '../config/env'

export class GithubOidcStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const provider = new iam.OpenIdConnectProvider(this, 'GitHubProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
    })

    const role = new iam.Role(this, 'GitHubActionsDeployRole', {
      roleName: 'GitHubActionsDeployRole',
      assumedBy: new iam.WebIdentityPrincipal(provider.openIdConnectProviderArn, {
        StringEquals: {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
        },
        StringLike: {
          'token.actions.githubusercontent.com:sub':
            `repo:${config.github.owner}/${config.github.repo}:ref:refs/heads/main`,
        },
      }),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess')],
      description: 'Assumed by GitHub Actions CI/CD for amowu.com',
    })

    new CfnOutput(this, 'DeployRoleArn', { value: role.roleArn })
  }
}
```

- [ ] **Step 2: Wire into `infra/bin/app.ts`**

```ts
import 'reflect-metadata'
import { App } from 'aws-cdk-lib'
import { config } from '../lib/config/env'
import { GithubOidcStack } from '../lib/stacks/github-oidc-stack'

const app = new App()
const env = { account: config.account, region: config.region }

new GithubOidcStack(app, 'GithubOidcStack', { env })
```

- [ ] **Step 3: Synth (no deploy)**

```bash
cd infra
CDK_DEFAULT_ACCOUNT=<your-account-id> npx cdk synth GithubOidcStack
cd ..
```
Expected: CloudFormation template printed to stdout, no errors.

> If you don't yet have account ID, use a dummy `123456789012` to verify synth works structurally.

- [ ] **Step 4: Commit**

```bash
git add infra/
git commit -m "feat(infra): add GitHub OIDC stack"
```

> **Deploy timing**: This stack is deployed once locally in Phase 12 / runbook, before any CI deploy runs.

### Task 10.3: Data stack (DynamoDB)

**Files:**
- Create: `infra/lib/stacks/data-stack.ts`
- Modify: `infra/bin/app.ts`

- [ ] **Step 1: Write `infra/lib/stacks/data-stack.ts`**

```ts
import { Stack, type StackProps, RemovalPolicy } from 'aws-cdk-lib'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import type { Construct } from 'constructs'
import { config } from '../config/env'

export class DataStack extends Stack {
  readonly resumeTable: dynamodb.ITable

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    this.resumeTable = new dynamodb.Table(this, 'ResumeTable', {
      tableName: config.tableName,
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecovery: true,
    })
  }
}
```

- [ ] **Step 2: Wire into `infra/bin/app.ts`**

```ts
import 'reflect-metadata'
import { App } from 'aws-cdk-lib'
import { config } from '../lib/config/env'
import { GithubOidcStack } from '../lib/stacks/github-oidc-stack'
import { DataStack } from '../lib/stacks/data-stack'

const app = new App()
const env = { account: config.account, region: config.region }

new GithubOidcStack(app, 'GithubOidcStack', { env })
new DataStack(app, 'DataStack', { env })
```

- [ ] **Step 3: Synth**

```bash
cd infra
CDK_DEFAULT_ACCOUNT=123456789012 npx cdk synth DataStack
cd ..
```
Expected: clean synth.

- [ ] **Step 4: Commit**

```bash
git add infra/
git commit -m "feat(infra): add DataStack with DynamoDB Resume table"
```

---

## Phase 11: `@amowu/infra` — API + Web stacks

**Why:** Define the runtime infra: Lambda container + HTTP API for `@amowu/api`, S3 + CloudFront + Route53 for `@amowu/web`.

### Task 11.1: API stack

**Files:**
- Create: `infra/lib/stacks/api-stack.ts`
- Modify: `infra/bin/app.ts`

- [ ] **Step 1: Write `infra/lib/stacks/api-stack.ts`** (spec §6.2)

```ts
import * as path from 'node:path'
import { Stack, type StackProps, Duration, CfnOutput } from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2'
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets'
import type * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import type { Construct } from 'constructs'
import { config } from '../config/env'

export interface ApiStackProps extends StackProps {
  readonly resumeTable: dynamodb.ITable
}

export class ApiStack extends Stack {
  readonly httpApi: apigwv2.HttpApi

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props)

    const apiLambda = new lambda.DockerImageFunction(this, 'ApiLambda', {
      functionName: 'amowu-api',
      code: lambda.DockerImageCode.fromImageAsset(
        path.join(__dirname, '../../../'),     // monorepo root
        {
          file: 'apps/api/Dockerfile',
          platform: ecr_assets.Platform.LINUX_AMD64,
        },
      ),
      memorySize: 512,
      timeout: Duration.seconds(10),
      environment: {
        AWS_REGION: this.region,
        DDB_TABLE_NAME: props.resumeTable.tableName,
        CORS_ORIGIN: `https://${config.domain.www}`,
        AWS_LWA_INVOKE_MODE: 'response_stream',
        PORT: '8080',
      },
    })

    props.resumeTable.grantReadData(apiLambda)

    this.httpApi = new apigwv2.HttpApi(this, 'HttpApi', {
      apiName: 'amowu-http-api',
      defaultIntegration: new HttpLambdaIntegration('ApiIntegration', apiLambda),
    })

    new CfnOutput(this, 'HttpApiEndpoint', { value: this.httpApi.apiEndpoint })
  }
}
```

- [ ] **Step 2: Wire into `infra/bin/app.ts`**

```ts
import 'reflect-metadata'
import { App } from 'aws-cdk-lib'
import { config } from '../lib/config/env'
import { GithubOidcStack } from '../lib/stacks/github-oidc-stack'
import { DataStack } from '../lib/stacks/data-stack'
import { ApiStack } from '../lib/stacks/api-stack'

const app = new App()
const env = { account: config.account, region: config.region }

new GithubOidcStack(app, 'GithubOidcStack', { env })
const dataStack = new DataStack(app, 'DataStack', { env })
new ApiStack(app, 'ApiStack', { env, resumeTable: dataStack.resumeTable })
```

- [ ] **Step 3: Synth**

```bash
cd infra
CDK_DEFAULT_ACCOUNT=123456789012 npx cdk synth ApiStack
cd ..
```
Expected: clean synth. Docker build may or may not happen depending on CDK CLI mode; if it does, expect ~30s build time.

- [ ] **Step 4: Commit**

```bash
git add infra/
git commit -m "feat(infra): add ApiStack with Docker Lambda + HTTP API"
```

### Task 11.2: Web stack

**Files:**
- Create: `infra/lib/stacks/web-stack.ts`
- Modify: `infra/bin/app.ts`

- [ ] **Step 1: Write `infra/lib/stacks/web-stack.ts`** (spec §6.2)

```ts
import * as path from 'node:path'
import { Stack, type StackProps, RemovalPolicy, Fn, CfnOutput } from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as route53_targets from 'aws-cdk-lib/aws-route53-targets'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import type * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2'
import type { Construct } from 'constructs'
import { config } from '../config/env'

export interface WebStackProps extends StackProps {
  readonly httpApi: apigwv2.HttpApi
}

export class WebStack extends Stack {
  constructor(scope: Construct, id: string, props: WebStackProps) {
    super(scope, id, props)

    const bucket = new s3.Bucket(this, 'WebBucket', {
      bucketName: config.bucketName,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.RETAIN,
    })

    const zone = route53.HostedZone.fromLookup(this, 'Zone', {
      domainName: config.domain.hostedZoneName,
    })

    const cert = acm.Certificate.fromCertificateArn(this, 'Cert', config.certificateArn)

    const apexRedirect = new cloudfront.Function(this, 'ApexRedirect', {
      code: cloudfront.FunctionCode.fromInline(`
        function handler(event) {
          var host = event.request.headers.host.value;
          if (host === '${config.domain.apex}') {
            return {
              statusCode: 301,
              statusDescription: 'Moved Permanently',
              headers: { location: { value: 'https://${config.domain.www}' + event.request.uri } }
            };
          }
          return event.request;
        }
      `),
    })

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [
          { function: apexRedirect, eventType: cloudfront.FunctionEventType.VIEWER_REQUEST },
        ],
      },
      additionalBehaviors: {
        '/api/*': {
          origin: new origins.HttpOrigin(
            Fn.select(2, Fn.split('/', props.httpApi.apiEndpoint)),
          ),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        },
      },
      // domainNames: [config.domain.www, config.domain.apex],   // ← INTENTIONALLY COMMENTED (cutover step)
      // certificate: cert,
      defaultRootObject: 'index.html',
      errorResponses: [
        { httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/index.html' },
        { httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/index.html' },
      ],
    })

    new s3deploy.BucketDeployment(this, 'DeployWeb', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../../apps/web/dist'))],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    })

    // Route53 records — left for cutover step (Phase 14)
    // new route53.ARecord(this, 'AliasWww', {
    //   zone, recordName: 'www',
    //   target: route53.RecordTarget.fromAlias(new route53_targets.CloudFrontTarget(distribution)),
    // })
    // new route53.ARecord(this, 'AliasApex', {
    //   zone, recordName: config.domain.apex,
    //   target: route53.RecordTarget.fromAlias(new route53_targets.CloudFrontTarget(distribution)),
    // })

    new CfnOutput(this, 'DistributionDomainName', { value: distribution.distributionDomainName })
    new CfnOutput(this, 'BucketName', { value: bucket.bucketName })

    // Quiet "unused" warnings for cert and zone (they ARE used after cutover uncomment)
    void cert
    void zone
    void route53_targets
  }
}
```

> Note: `domainNames`, `certificate`, and Route53 records are intentionally commented during Phase 1 deploy. Uncomment during Phase 14 cutover (spec §9 Phase 2 step 3).

- [ ] **Step 2: Wire into `infra/bin/app.ts`**

```ts
import 'reflect-metadata'
import { App } from 'aws-cdk-lib'
import { config } from '../lib/config/env'
import { GithubOidcStack } from '../lib/stacks/github-oidc-stack'
import { DataStack } from '../lib/stacks/data-stack'
import { ApiStack } from '../lib/stacks/api-stack'
import { WebStack } from '../lib/stacks/web-stack'

const app = new App()
const env = { account: config.account, region: config.region }

new GithubOidcStack(app, 'GithubOidcStack', { env })
const dataStack = new DataStack(app, 'DataStack', { env })
const apiStack = new ApiStack(app, 'ApiStack', { env, resumeTable: dataStack.resumeTable })
new WebStack(app, 'WebStack', { env, httpApi: apiStack.httpApi })
```

- [ ] **Step 3: Synth all stacks**

```bash
cd infra
CDK_DEFAULT_ACCOUNT=123456789012 npx cdk synth
cd ..
```
Expected: all four stacks synth without errors (HostedZone.fromLookup may complain without real account — that's expected at dummy synth time).

- [ ] **Step 4: Commit**

```bash
git add infra/
git commit -m "feat(infra): add WebStack with S3 + CloudFront + apex redirect"
```

---

## Phase 12: GitHub Actions `ci-cd.yml` + Branch Protection

**Why:** Automate verify (lint/typecheck/test/build) and deploy. Protect main from direct push.

### Task 12.1: Add `ci-cd.yml`

**Files:**
- Create: `.github/workflows/ci-cd.yml`

- [ ] **Step 1: Write `.github/workflows/ci-cd.yml`** (spec §7.1)

```yaml
name: CI/CD
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
permissions:
  id-token: write
  contents: read
  pull-requests: read

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
      - run: npm run build

  deploy:
    needs: verify
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/GitHubActionsDeployRole
          aws-region: us-east-1
      - run: npm run cdk -- deploy DataStack ApiStack WebStack --require-approval never
```

> `AWS_ACCOUNT_ID` is a repo secret you set in GitHub after Phase 14 Phase 1 OIDC deploy.

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci-cd.yml
git commit -m "feat(ci): add unified CI/CD workflow"
```

### Task 12.2: Branch protection (manual, GitHub UI)

> This step is done in GitHub UI, not in code.

- [ ] **Step 1: Wait until Phase 14 Phase 1 deploy succeeds at least once** so the `verify` status check exists in GitHub history.

- [ ] **Step 2: Go to `Settings → Branches → Add branch protection rule`**

- Branch name pattern: `main`
- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging → select `verify`
- ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing the above settings

- [ ] **Step 3: Save**

After this, direct `git push origin main` is rejected. All changes go via PR.

---

## Phase 13: Data migration

**Why:** Pull real resume data from the old DynamoDB table, validate against `ResumeSchema`, commit to `seeds/`, and prepare a script for one-time seed of the new prod table.

**Pre-req values (spec §10):**
- Old DynamoDB table name (look up in AWS console)
- AWS profile or credentials with read access to old table

### Task 13.1: Migration script (old DDB → seeds/resume.json)

**Files:**
- Create: `scripts/migrate-resume-data.ts`

- [ ] **Step 1: Write `scripts/migrate-resume-data.ts`** (spec §8)

```ts
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { writeFile } from 'node:fs/promises'

const OLD_TABLE = process.env.OLD_TABLE_NAME
if (!OLD_TABLE) {
  console.error('Set OLD_TABLE_NAME env var to the old DynamoDB table name')
  process.exit(1)
}

const client = new DynamoDBClient({ region: 'us-east-1' })

async function main() {
  const result = await client.send(new ScanCommand({ TableName: OLD_TABLE }))
  const items = result.Items?.map(unmarshall) ?? []
  console.log(`Scanned ${items.length} items from ${OLD_TABLE}`)
  await writeFile('apps/api/seeds/resume.json', JSON.stringify(items, null, 2))
  console.log('Wrote apps/api/seeds/resume.json')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
```

- [ ] **Step 2: Run with real AWS profile**

```bash
AWS_PROFILE=<your-profile> OLD_TABLE_NAME=<old-table> npx tsx scripts/migrate-resume-data.ts
```

- [ ] **Step 3: Inspect output, sanity-check fields**

```bash
cat apps/api/seeds/resume.json | jq .
```

- [ ] **Step 4: If fields don't match `ResumeSchema`, update the schema (and re-run shared tests)**

E.g., real data has additional fields not in placeholder schema. Update `packages/shared/src/resume.schema.ts` to add them, then re-run:

```bash
npm run test -w @amowu/shared
```

- [ ] **Step 5: Validate seed against schema** (write a tiny ad-hoc check)

```bash
node -e "
const { ResumeSchema } = require('./packages/shared/src/resume.schema.ts');
const data = require('./apps/api/seeds/resume.json');
data.forEach((r) => ResumeSchema.parse(r));
console.log('All', data.length, 'resumes valid');
"
```

> Adjust if your ts compilation requires `tsx` instead of `node`.

- [ ] **Step 6: Commit**

```bash
git add scripts/migrate-resume-data.ts apps/api/seeds/resume.json packages/shared/
git commit -m "chore: migrate resume data from old DynamoDB"
```

> If resume contains PII you don't want in git history, `.gitignore` `apps/api/seeds/resume.json` and store it locally + push to prod table directly in Task 13.2.

### Task 13.2: Production seed script

**Files:**
- Create: `apps/api/scripts/seed-prod-ddb.ts`

- [ ] **Step 1: Write `apps/api/scripts/seed-prod-ddb.ts`**

```ts
import { readFile } from 'node:fs/promises'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { makeResumeEntity } from '../src/resume/resume.entity'

const TABLE_NAME = process.env.DDB_TABLE_NAME ?? 'resume-prod'
const SEED_FILE = new URL('../seeds/resume.json', import.meta.url)

async function main() {
  const client = new DynamoDBClient({ region: 'us-east-1' })
  const entity = makeResumeEntity({ client, tableName: TABLE_NAME })
  const raw = await readFile(SEED_FILE, 'utf-8')
  const items = JSON.parse(raw)
  for (const item of items) {
    await entity.put(item).go()
    console.log(`Seeded resume ${item.id} to ${TABLE_NAME}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
```

> Runs against real AWS (uses default credential chain). Used in Phase 14 Phase 1 step 6.

- [ ] **Step 2: Commit**

```bash
git add apps/api/scripts/seed-prod-ddb.ts
git commit -m "feat(api): add prod DDB seed script"
```

---

## Phase 14: Cutover (manual runbook)

**Why:** All code is ready. Now switch traffic from old to new infrastructure. This is a sequence of manual operations + targeted CDK changes.

> **Per spec §9**, this happens in 4 sub-phases. Treat each Step below as one task.

### Task 14.1: Phase 1 — Parallel deployment (no traffic switch yet)

- [ ] **Step 1: Set CDK_DEFAULT_ACCOUNT and CDK_DEFAULT_REGION env vars**

```bash
export CDK_DEFAULT_ACCOUNT=<your-aws-account-id>
export CDK_DEFAULT_REGION=us-east-1
```

- [ ] **Step 2: Update `infra/lib/config/env.ts` with real `account` and `certificateArn`**

```ts
export const config = {
  account: '123456789012',                          // real account ID
  region: 'us-east-1',
  // ...
  certificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/<uuid>',
  // ...
}
```

Commit:
```bash
git add infra/lib/config/env.ts
git commit -m "chore(infra): fill in production AWS account and cert ARN"
```

- [ ] **Step 3: Bootstrap CDK in account (first time only)**

```bash
cd infra && npx cdk bootstrap aws://${CDK_DEFAULT_ACCOUNT}/us-east-1 && cd ..
```

- [ ] **Step 4: Deploy GithubOidcStack from local machine**

```bash
cd infra && npx cdk deploy GithubOidcStack && cd ..
```

Note the output `DeployRoleArn` — copy it.

- [ ] **Step 5: Add `AWS_ACCOUNT_ID` as GitHub repo secret**

In GitHub UI: `Settings → Secrets and variables → Actions → New repository secret`:
- Name: `AWS_ACCOUNT_ID`
- Value: your AWS account ID

- [ ] **Step 6: Merge feature branch via PR to main → CD pipeline triggers DataStack + ApiStack + WebStack deploy**

```bash
# Push final commits, then on GitHub UI: open PR feature/fullstack-migration → main, merge
# CD workflow auto-runs
```

Monitor in GitHub Actions tab. Verify all three stacks deploy successfully.

- [ ] **Step 7: Find new CloudFront distribution domain**

```bash
aws cloudformation describe-stacks --stack-name WebStack --query "Stacks[0].Outputs[?OutputKey=='DistributionDomainName'].OutputValue" --output text
# Expected: d1234abcd.cloudfront.net
```

- [ ] **Step 8: Seed prod DynamoDB**

```bash
DDB_TABLE_NAME=resume-prod AWS_PROFILE=<your-profile> npx tsx apps/api/scripts/seed-prod-ddb.ts
```

- [ ] **Step 9: Smoke test new infrastructure via CloudFront default URL**

```bash
curl -sf https://<new-distribution>.cloudfront.net/ > /dev/null && echo "site ok"
curl -sf https://<new-distribution>.cloudfront.net/api/resume | jq .
```
Expected: HTML returns; API returns real resume data.

Open in browser to test Phaser game, dialogue, /resume page interactively. **Do not proceed to Phase 2 until you're satisfied.**

### Task 14.2: Phase 2 — Traffic switch (short race window)

- [ ] **Step 1: Remove `www.amowu.com` alias from OLD CloudFront**

In AWS Console → CloudFront → old distribution → edit → remove `www.amowu.com` (and `amowu.com` if present) from Alternate Domain Names → save. Wait ~5 min for propagation.

- [ ] **Step 2: Uncomment `domainNames`, `certificate`, and Route53 records in `infra/lib/stacks/web-stack.ts`**

Uncomment the three blocks:
```ts
domainNames: [config.domain.www, config.domain.apex],
certificate: cert,
```
and:
```ts
new route53.ARecord(this, 'AliasWww', { ... })
new route53.ARecord(this, 'AliasApex', { ... })
```

- [ ] **Step 3: Open PR → CI passes → merge → CD redeploys WebStack with alias**

(Branch protection prevents direct push — must go via PR.)

```bash
# Push commit, open PR, wait for verify, merge
```

- [ ] **Step 4: Verify Route53 records updated**

```bash
dig www.amowu.com +short
dig amowu.com +short
```
Expected: both resolve to the new CloudFront IPs (different from old).

### Task 14.3: Phase 3 — Verification (24-48 hours)

- [ ] **Step 1: External verification**

```bash
curl -sfL https://www.amowu.com/ -o /dev/null && echo "www ok"
curl -sfI https://amowu.com/ | head -1                # expect 301
curl -sfL https://amowu.com/                          # expect content after redirect
curl -sf https://www.amowu.com/api/resume | jq .
```

- [ ] **Step 2: Open https://www.amowu.com in browser**, walk through:
- Phaser game loads
- Player movement
- NPC dialogue triggers
- /resume route shows resume

- [ ] **Step 3: Wait 24-48 hours**, occasionally hit endpoints to confirm uptime.

### Task 14.4: Phase 4 — Cleanup (1 month after cutover)

Per spec §9 Phase 4. Manual AWS console actions:

- [ ] Delete old CloudFront distribution
- [ ] Delete old S3 buckets (`www.amowu.com`, `amowu.com` redirect bucket)
- [ ] Delete old Lambda + API Gateway
- [ ] Delete old DynamoDB table
- [ ] Disconnect CircleCI from repo (GitHub UI: `Settings → Integrations`)
- [ ] In a separate PR: `git rm -rf src/frontend src/backend circle.yml config/` and delete the legacy `scripts/` files (`deploy_staging.sh`, etc.)

```bash
git checkout -b chore/remove-legacy-stack
git rm -rf src/frontend src/backend circle.yml
git rm scripts/deploy_staging.sh scripts/deploy_production.sh   # adjust to real list
git commit -m "chore: remove legacy Vue 1.x + Serverless code"
# Open PR, merge
```

---

## Final wrap-up

After Phase 14 is verified:

- [ ] Update README.md to reflect the new stack
- [ ] Update CLAUDE.md to remove Vue 1.x / Webpack 1 / Karma references
- [ ] Tag a `v2.0.0` release on main

```bash
# After cleanup PR is merged:
git checkout main && git pull
git tag v2.0.0 -m "Fullstack migration: Vue 1 → React 19, Serverless → CDK"
git push origin v2.0.0
```

---

## Appendix A: Self-Check Commands

When in doubt, these are the local sanity checks:

```bash
# Lint everything
npm run lint

# Typecheck everything
npm run typecheck

# Test everything
npm run test

# Build everything
npm run build

# Run API locally
npm run dev -w @amowu/api

# Run web locally
npm run dev -w @amowu/web

# Synth all CDK stacks
cd infra && npx cdk synth && cd ..

# Synth a specific stack
cd infra && npx cdk synth WebStack && cd ..

# Run Phase 13 migration
OLD_TABLE_NAME=<old> AWS_PROFILE=<profile> npx tsx scripts/migrate-resume-data.ts
```

## Appendix B: Spec values to fill at execution time

Per spec §10:

| Value | Where to put it |
|---|---|
| Old DynamoDB table name | `OLD_TABLE_NAME` env when running migrate script |
| AWS account ID | `infra/lib/config/env.ts` `config.account` + GitHub secret `AWS_ACCOUNT_ID` |
| ACM cert ARN | `infra/lib/config/env.ts` `config.certificateArn` |
| Route53 hosted zone ID | Auto-resolved by `HostedZone.fromLookup` |
