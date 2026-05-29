# amowu.com 全棧現代化遷移設計

**日期**：2026-05-30
**分支**：`feature/fullstack-migration`
**目標**：將擱置十年的個人網站（Vue 1.x + Serverless Framework 0.5.6 + CircleCI）整批換成現代技術棧，內容與功能保留。

---

## 1. 範圍與原則

### 1.1 範圍

| 項目 | 從 | 到 |
|---|---|---|
| Frontend framework | Vue 1.x | React 19 |
| Frontend build | Webpack 1 + Babel | Vite 5 + TS |
| Game engine | Phaser 2.6 | Phaser 4 |
| Routing | vue-router 0.7 | TanStack Router (file-based) |
| State / data fetching | Vuex + vue-resource | TanStack Query + useReducer |
| UI library | Semantic UI + theaterjs | animal-island-ui + Tailwind |
| Backend framework | Serverless Framework 0.5.6 + 裸 Lambda handler | NestJS + Lambda Web Adapter (Docker) |
| Infrastructure | Serverless Framework | AWS CDK v2 (TypeScript) |
| Database | DynamoDB（保留） | DynamoDB（重建 + 資料遷移） |
| CI/CD | CircleCI | GitHub Actions + OIDC |
| Node | 4.3 | 22 LTS |
| Package manager | npm 2.x（隱含） | npm 10+ workspaces |
| Repo 結構 | `src/frontend` + `src/backend` | `apps/` + `packages/` + `infra/` monorepo |
| 分支策略 | Gitflow（develop + master + hotfix） | Trunk-based（單一 main） |
| 環境 | staging + production | 單一 production |
| Domain / DNS | `www.amowu.com` 主，`amowu.com` 重導 (S3 redirect bucket) | 維持 www 主、CloudFront Function 做 apex 301 |

### 1.2 原則

- **Greenfield 重寫**，不漸進式 migration（Vue 1.x / Webpack 1 / Node 4 在現代工具鏈無法安裝）
- **內容與互動意圖保留**：Phaser 遊戲玩法、對話樹、resume 資料、整體 NPC 對話互動的網站個性全部保留
- **UI/UX 視覺可重新設計**：Semantic UI 換成 animal-island-ui（動森風），跟既有 Phaser RPG 風格更搭
- **CDK 不接管既有 Route53 zone、ACM cert**：用 `fromLookup` / `fromCertificateArn` 引用，避免動到 DNS / cert
- **既有 DynamoDB / S3 / CloudFront 不 import 進 CDK**：全新建 + DNS 切換 + 一個月後手動刪舊

---

## 2. Repo 結構

```
amowu.com/
├── package.json                    # root: workspaces 定義、shared scripts
├── tsconfig.base.json              # 共用 TS config
├── eslint.config.js                # ESLint 9 flat config
├── .prettierrc
├── docker-compose.yml              # 本地 DynamoDB Local
├── .github/workflows/
│   ├── ci.yml                      # PR + push main: lint + typecheck + test + build
│   └── cd.yml                      # push main: cdk deploy --all
│
├── apps/
│   ├── web/                        # React 19 + Phaser 4 + Vite + TS
│   └── api/                        # NestJS + LWA + Docker
│
├── packages/
│   └── shared/                     # 前後端共用：Zod schema + 推導 type
│
├── infra/                          # AWS CDK app (TypeScript v2)
│
├── scripts/
│   └── migrate-resume-data.ts      # 一次性：從舊 DDB 撈資料進 repo
│
└── docs/
    └── superpowers/specs/
        └── 2026-05-30-fullstack-migration-design.md   # 本文件
```

**Workspace 命名**：`@amowu/web`、`@amowu/api`、`@amowu/shared`、`@amowu/infra`

**Build 依賴順序**：`@amowu/shared` → `@amowu/web` + `@amowu/api`（平行）→ `@amowu/infra`（讀 web/dist + api/Dockerfile）

**工具鏈：**
- Node 22 LTS（`.nvmrc`）
- npm 10+ workspaces
- TypeScript 5.x，root `tsconfig.base.json`，各 workspace `extends` 後客製
- ESLint 9 flat config + `@typescript-eslint`
- Prettier
- 暫不加 commit hook（個人專案自律）

---

## 3. Frontend (`apps/web/`)

### 3.1 基底

直接用 [`phaserjs/template-react-ts`](https://github.com/phaserjs/template-react-ts) 為骨架（Phaser 4 + React 19 + Vite + TS）。保留以下 template 元件：

- `src/main.tsx`、`src/PhaserGame.tsx`
- `src/game/main.ts`、`src/game/EventBus.ts`
- `vite/config.{dev,prod}.mjs`、`tsconfig.json`、`tsconfig.node.json`

修改 template：
- `src/App.tsx`：從「render PhaserGame」改成 `<RouterProvider />` + `<QueryClientProvider />` 根組件
- `.eslintrc.cjs`：移除，改用 monorepo root 的 flat config
- Scene 內容全部重寫成實際遊戲場景

### 3.2 結構

```
apps/web/
├── index.html
├── vite/config.{dev,prod}.mjs      # template 沿用；dev 設 /api proxy → localhost:8080
├── tsconfig.json
├── package.json
├── public/
│   └── assets/                      # 從舊 phaser-game/ 搬過來的 tileset、PNG、tilemap JSON、音效
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   │
│   ├── routes/                      # TanStack Router file-based
│   │   ├── __root.tsx               # 永遠掛 <PhaserGame />、<Outlet />、<DialogueOverlay />
│   │   ├── index.tsx                # /            （無路由 overlay，純背景遊戲）
│   │   └── resume.tsx               # /resume      履歷頁 overlay
│   │
│   ├── features/                    # 按功能切
│   │   ├── dialogue/
│   │   │   ├── DialogueOverlay.tsx
│   │   │   ├── DialogueBox.tsx
│   │   │   ├── DialogueOptions.tsx
│   │   │   ├── useDialogueMachine.ts   # useReducer FSM: idle / typing / waiting / closing
│   │   │   ├── dialogues.ts            # 對話樹（type-safe）
│   │   │   └── types.ts                # DialogueNode、DialogueNext
│   │   ├── resume/
│   │   │   ├── ResumePage.tsx
│   │   │   ├── ResumeCard.tsx
│   │   │   ├── useResume.ts            # TanStack Query: GET /api/resume
│   │   │   └── components/
│   │   └── game/
│   │       └── PhaserGame.tsx          # template 沿用，包 Phaser.Game 生命週期
│   │
│   ├── game/                        # 純 Phaser，不 import React
│   │   ├── main.ts
│   │   ├── EventBus.ts
│   │   └── scenes/
│   │       ├── Boot.ts
│   │       ├── Preloader.ts
│   │       └── WorldScene.ts        # 取代 template demo scenes
│   │
│   ├── lib/
│   │   ├── api-client.ts            # fetch wrapper，整合 @amowu/shared schema
│   │   └── queryClient.ts
│   │
│   └── styles/
│       └── globals.css              # Tailwind + 字型 cascade override
│
└── tests/
    ├── unit/                        # Vitest + React Testing Library
    └── e2e/                         # Playwright（最小化、不進 CI）
```

### 3.3 關鍵設計

**Phaser 跨路由保留**：`<PhaserGame />` 掛在 `__root.tsx`，永不 unmount。路由切換只是上面的 overlay 換內容：

```tsx
// src/routes/__root.tsx
export const Route = createRootRoute({
  component: () => (
    <>
      <PhaserGame />          {/* 永遠在背景跑 */}
      <Outlet />              {/* /, /resume 切換的 overlay */}
      <DialogueOverlay />     {/* 永遠掛載，需要時顯示 */}
    </>
  ),
})
```

**Dialogue 系統重設計**：

- **邊界**：Phaser 與 React 透過 template 內建的 `EventBus`（Phaser.Events.EventEmitter）通訊。Phaser 觸發 NPC 對話：
  ```ts
  EventBus.emit('dialogue:open', 'npc_amo_intro')
  EventBus.emit('game:pause')
  ```
- **React 內部狀態**：`DialogueOverlay` 用 `useReducer` 管 FSM（`idle | typing | waiting-option | closing`）
- **對話樹資料 type-safe**：
  ```ts
  type DialogueNext =
    | { kind: 'dialogue'; id: keyof typeof dialogues }
    | { kind: 'route'; to: '/' | '/resume' }
    | { kind: 'url'; href: string }
    | { kind: 'options'; items: Array<{ label: string; next: DialogueNext }> }
    | { kind: 'close' }
  type DialogueNode = { text: string; next: DialogueNext }
  ```
- **不用全域 store**（不引入 Zustand）；對話狀態只在 `DialogueOverlay` 內部

**Resume 抓取**：`useResume()` 用 TanStack Query，內部 fetch 後 `ResumeSchema.parse(...)` 做 runtime 驗證 + type 推導。

**UI / 字型：**

- **元件**：[`animal-island-ui`](https://github.com/guokaigdg/animal-island-ui)（v0.9.4，鎖死版本）— Modal、Typewriter、Button、Card、Tabs。Modal + Typewriter 用來取代舊 DialoguePage 元件 + theaterjs。
- **Layout**：Tailwind CSS 處理 grid / spacing / responsive
- **字型** (`@fontsource/`)：
  - 英文：Nunito（保留動森風）
  - 日文：Zen Maru Gothic（保留動森風）
  - 中文：Noto Sans TC（新增，覆蓋 library 預設的 SC）
- **覆蓋方式**：`apps/web/src/styles/globals.css` 用 CSS cascade override：
  ```css
  body, button, input, .ai-modal, .ai-card {
    font-family: 'Nunito', 'Zen Maru Gothic', 'Noto Sans TC', sans-serif;
  }
  ```

### 3.4 舊功能對應

| 舊 | 新 |
|---|---|
| `pages/DialoguePage.vue` | `features/dialogue/DialogueOverlay.tsx`（**改成元件、永遠掛載**） |
| `pages/GamePage.vue` | `features/game/PhaserGame.tsx` + `src/game/` |
| `pages/ResumePage.vue` | `features/resume/ResumePage.tsx` |
| `phaser-game/Tilemap.js` + tileset | `public/assets/` 直接搬資產，Phaser 4 code 重寫 |
| `actions/dialogues.js` 對話腳本 | `features/dialogue/dialogues.ts`（轉成 type-safe） |
| `core/store` (Vuex) | 移除，分別用 TanStack Query / useReducer / EventBus |
| `App.vue` 三層疊（game-page + dialogue-page + router-view） | `__root.tsx` 三層疊（PhaserGame + Outlet + DialogueOverlay） |

### 3.5 測試

- **Vitest**：unit / component tests（dialogue reducer、resume schema parse、API client wrapper）
- **Playwright**：少量關鍵 e2e（resume page render、API 抓到資料、Phaser canvas 出現），手動跑、不進 CI

---

## 4. Backend (`apps/api/`)

### 4.1 Stack

NestJS（Express platform）+ Lambda Web Adapter（Container image）+ DynamoDB（AWS SDK v3）

### 4.2 結構

```
apps/api/
├── Dockerfile                      # LWA container image
├── package.json
├── tsconfig.json
├── nest-cli.json
├── seeds/
│   └── resume.json                 # 從舊 prod DDB 撈出來的真實資料
├── scripts/
│   ├── init-local-ddb.ts           # 在 localhost:8000 建 Resume table schema
│   ├── seed-local-ddb.ts           # 灌 seeds/resume.json 到本地
│   └── seed-prod-ddb.ts            # 一次性：灌進 prod table（切換時用）
├── src/
│   ├── main.ts                     # NestFactory.create + listen(PORT=8080)
│   ├── app.module.ts
│   ├── config/
│   │   ├── config.module.ts
│   │   └── env.schema.ts           # Zod 驗證環境變數
│   ├── infra/dynamodb/
│   │   ├── dynamodb.module.ts
│   │   └── dynamodb.client.ts      # 注入 DynamoDBClient
│   └── resume/
│       ├── resume.module.ts
│       ├── resume.controller.ts    # GET /resume
│       ├── resume.service.ts
│       └── resume.repository.ts
└── tests/
    └── resume.controller.spec.ts   # Vitest
```

### 4.3 關鍵設計

**Nest bootstrap：**

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')                            // 所有 endpoint /api/*
  app.enableCors({ origin: process.env.CORS_ORIGIN })
  await app.listen(process.env.PORT ?? 8080)
}
```

**三層分層**：Controller → Service → Repository。
- Controller：HTTP 入口，response 用 `ResumeSchema.parse()` 驗證
- Service：業務邏輯（目前只有 `findOne()`）
- Repository：純 DynamoDB 存取

**從 `@amowu/shared` import Zod schema 跟 type**，前後端共用單一 source of truth。

**環境變數**（全部用 Zod schema 驗證，啟動時驗不過直接 crash）：

| 變數 | Local | Prod |
|---|---|---|
| `PORT` | 8080 | 8080 |
| `AWS_REGION` | us-east-1 | us-east-1 |
| `DDB_ENDPOINT` | `http://localhost:8000` | (unset) |
| `DDB_TABLE_NAME` | `resume-local` | `resume-prod`（CDK 注入） |
| `CORS_ORIGIN` | `http://localhost:5173` | `https://www.amowu.com` |

**Dockerfile**：

```dockerfile
FROM public.ecr.aws/lambda/nodejs:22 AS deps
WORKDIR /tmp
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --workspace=@amowu/api --include-workspace-root

FROM public.ecr.aws/lambda/nodejs:22
COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.8.4 \
     /lambda-adapter /opt/extensions/lambda-adapter
ENV PORT=8080 AWS_LWA_INVOKE_MODE=response_stream
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=deps /tmp/node_modules ./node_modules
COPY apps/api/dist ./
CMD ["main.js"]
```

### 4.4 本地開發 DX

**Root `docker-compose.yml`：**

```yaml
services:
  dynamodb:
    image: amazon/dynamodb-local:latest
    container_name: amowu-dynamodb
    ports: ["8000:8000"]
    command: -jar DynamoDBLocal.jar -sharedDb -dbPath /data
    volumes: ["dynamodb-data:/data"]
volumes:
  dynamodb-data:
```

**`apps/api/package.json` scripts：**

```json
{
  "scripts": {
    "ddb:init":  "tsx scripts/init-local-ddb.ts",
    "ddb:seed":  "tsx scripts/seed-local-ddb.ts",
    "ddb:reset": "npm run ddb:init && npm run ddb:seed",
    "predev":    "docker compose -f ../../docker-compose.yml up -d dynamodb && npm run ddb:reset",
    "dev":       "nest start --watch"
  }
}
```

一個指令 `npm run dev -w @amowu/api` 自動：起 DDB Local → 建 table → 灌 seed → 啟 Nest。

---

## 5. Shared Package (`packages/shared/`)

```
packages/shared/
├── package.json                 # name: @amowu/shared
├── tsconfig.json
└── src/
    ├── index.ts
    └── resume.schema.ts         # ResumeSchema (Zod) + type Resume = z.infer<...>
```

純 TS package，no build step（直接 source import 或最簡 `tsc` build）。Web 與 API 都 import：

```ts
import { ResumeSchema, type Resume } from '@amowu/shared'
```

未來可擴增 `dialogue.schema.ts`、`api-contract.ts` 等。需要對外暴露 OpenAPI 時用 `@asteasolutions/zod-to-openapi` 從 Zod 生成。

---

## 6. Infrastructure (`infra/`)

### 6.1 Stack 拆分

```
infra/
├── bin/app.ts
├── lib/
│   ├── stacks/
│   │   ├── github-oidc-stack.ts    # GitHub OIDC provider + deploy role（一次性）
│   │   ├── data-stack.ts           # DynamoDB
│   │   ├── api-stack.ts            # Lambda (Docker) + API Gateway HTTP API
│   │   └── web-stack.ts            # S3 + CloudFront + Route53
│   └── config/
│       └── env.ts                  # account ID、region、domain、cert ARN 常數
└── cdk.json
```

**依賴關係：**
```
github-oidc-stack   ← 獨立，一次性部署
data-stack          ← 獨立
   ↑
api-stack           ← 依賴 data-stack（table ARN）
   ↑
web-stack           ← 依賴 api-stack（API URL）
```

### 6.2 Stack 細節

**`github-oidc-stack`**：建 GitHub OIDC provider + IAM role，trust policy 限定 `repo:amowu/amowu.com:ref:refs/heads/main`。Role 暫用 `AdministratorAccess`（個人專案先求簡單，未來收斂）。

**`data-stack`**：
```ts
new dynamodb.Table(this, 'ResumeTable', {
  tableName: 'resume-prod',
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
  removalPolicy: RemovalPolicy.RETAIN,
  pointInTimeRecovery: true,
})
```

**`api-stack`**：`lambda.DockerImageFunction` 從 `apps/api/Dockerfile` build，memory 512MB、timeout 10s、`PAY_PER_REQUEST`。給 `grantReadData` only。API Gateway HTTP API 接 Lambda integration。

**`web-stack`**：
- S3 bucket `amowu-com-prod-web`（private，無 public access）
- CloudFront distribution：
  - Default behavior → S3 OAC（`origins.S3BucketOrigin.withOriginAccessControl()`）
  - `/api/*` behavior → API Gateway HTTP API origin（不快取）
  - `domainNames: ['www.amowu.com', 'amowu.com']`
  - 引用既有 ACM cert（`Certificate.fromCertificateArn`）
  - `errorResponses`：404 / 403 → 200 + `index.html`（SPA fallback）
- **CloudFront Function 做 apex redirect**：
  ```js
  function handler(event) {
    var host = event.request.headers.host.value;
    if (host === 'amowu.com') {
      return {
        statusCode: 301,
        statusDescription: 'Moved Permanently',
        headers: { location: { value: 'https://www.amowu.com' + event.request.uri } }
      };
    }
    return event.request;
  }
  ```
- `BucketDeployment` 部署 `apps/web/dist` 進 bucket，自動 invalidate `/*`
- Route53：`www.amowu.com` 和 `amowu.com` 兩個 A-alias 都指向同一 distribution（zone 用 `HostedZone.fromLookup` 引用，不重建）

### 6.3 設計決定

- **4 個 stack，不合併**：data 跟 web/api 生命週期不同，拆開 `cdk destroy api-stack` 不會誤刪 DDB
- **`RemovalPolicy.RETAIN`** 加在 DynamoDB 與 S3：CDK destroy / replace 都不會刪資料
- **CloudFront OAC（新版）** 取代 OAI（已 deprecated）
- **SPA fallback 用 errorResponses**，bucket 保持 private
- **`/api/*` 走 CloudFront 同源**：免 CORS、URL 漂亮（`https://www.amowu.com/api/resume`）
- **L3 construct 暫不抽**：個人專案沒重複需求
- **單一 region us-east-1**，單一 account，無 staging/prod 切換

---

## 7. CI/CD（GitHub Actions）

### 7.1 Workflows

**`.github/workflows/ci.yml`**（PR + push main 觸發）：
```yaml
on:
  pull_request: { branches: [main] }
  push: { branches: [main] }
jobs:
  lint-test-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test
      - run: npm run build
```

**`.github/workflows/cd.yml`**（push main 觸發）：
```yaml
on:
  push: { branches: [main] }
permissions:
  id-token: write
  contents: read
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }
      - run: npm ci
      - run: npm run build
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::<account-id>:role/GitHubActionsDeployRole
          aws-region: us-east-1
      - run: npm run cdk -w @amowu/infra -- deploy --all --require-approval never
```

### 7.2 Branch protection

`Settings → Branches → main`：
- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging（select `lint-test-build`）
- ✅ Require branches to be up to date before merging
- ✅ Do not allow bypassing the above settings

效果：直 push main 被 GitHub server 拒絕，強制 PR flow。

### 7.3 OIDC 第一次 bootstrap

第一次部署 `github-oidc-stack` 用本機 AWS profile：

```bash
npm run cdk -w @amowu/infra -- deploy github-oidc-stack
```

之後 GitHub Actions 就能 assume role，後續 stacks 全自動。

---

## 8. 資料遷移

**一次性 script**：`scripts/migrate-resume-data.ts`

```ts
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb'
import { writeFile } from 'node:fs/promises'

const client = new DynamoDBClient({ region: 'us-east-1' })
const result = await client.send(new ScanCommand({ TableName: '<舊 table 名稱>' }))
const items = result.Items!.map(unmarshall)
await writeFile('apps/api/seeds/resume.json', JSON.stringify(items, null, 2))
```

**流程：**

1. 本機 `tsx scripts/migrate-resume-data.ts` → 撈出舊 resume 資料寫進 `apps/api/seeds/resume.json`
2. 校稿、清理測試資料、確認符合 `ResumeSchema`
3. Commit 進 `feature/fullstack-migration`（資料若敏感則改 `.gitignore` 後手動帶入 prod）
4. 新 CDK stack 部署後，跑 `apps/api/scripts/seed-prod-ddb.ts` 灌進新 DynamoDB
5. 舊 DynamoDB table 保留 1 個月後手動刪

---

## 9. 切換計劃

### Phase 0：準備（不影響線上）

- 在 `feature/fullstack-migration` 完成全部 code
- 本機 `npm run dev` 跑通整個 stack（DDB Local + Nest + Vite + Phaser）
- 撈舊 resume 進 `seeds/`

### Phase 1：並行部署（不切流量）

1. 本機部署 `github-oidc-stack`（一次性）
2. Merge feature branch 進 main → GitHub Actions 自動跑 cd.yml
3. CDK 部署 data + api + web 三個 stacks
4. **CloudFront 暫時不掛 `www.amowu.com` / `amowu.com` alias**（CDK code 先註解 `domainNames`），避免跟舊 distribution 衝突
5. 透過 CloudFront 預設 URL `dXXXX.cloudfront.net` 完整驗證：
   - Phaser 遊戲載入、可玩
   - 對話流程正常
   - `/resume` 路由 + API 抓 resume 正確
6. 跑 `seed-prod-ddb.ts` 把資料灌進新 DynamoDB

### Phase 2：切換（5-30 分鐘 race window）

1. 從舊 CloudFront distribution 拿掉 `www.amowu.com` alias（AWS console / CLI）
2. 等 ~5 分鐘 CloudFront propagation
3. 修 CDK code：取消註解 `domainNames`，開 PR → CI 通過 → merge main（branch protection 不允許直 push）
4. GitHub Actions 自動 deploy → 新 CloudFront 掛上兩個 alias
5. Route53 兩個 A-record alias target 改指到新 distribution
6. 等 ~5 分鐘 DNS propagation

### Phase 3：驗證（24-48 小時）

- `https://www.amowu.com` → 新站
- `https://amowu.com` → 301 → www（CloudFront Function）
- `https://www.amowu.com/api/resume` → 新 Lambda

### Phase 4：清理（切完 1 個月後）

手動刪除：
- 舊 CloudFront distribution
- 舊 S3 buckets（`www.amowu.com`、`amowu.com` redirect bucket）
- 舊 Lambda / API Gateway / DynamoDB table
- CircleCI repo 連結

---

## 10. 部署時才確定的值

以下值在 spec 撰寫時不會寫死，部署時或第一次 setup 時填入：

| 值 | 用途 | 取得時機 |
|---|---|---|
| 舊 DynamoDB table 名稱 | `scripts/migrate-resume-data.ts` 來源 | 部署前查 AWS console |
| AWS account ID | `cd.yml` 的 `role-to-assume` ARN | 第一次 OIDC stack 部署後 |
| ACM cert ARN | `web-stack` 引用 | 查 AWS console（既有 cert） |
| Route53 hosted zone ID | `web-stack` 引用（用 `HostedZone.fromLookup` 自動帶） | CDK 自動 |
| ECR repository URI | CDK 自動建立 | CDK 自動 |

`infra/lib/config/env.ts` 集中放這些常數，方便日後審查。

---

## 11. 不在此次範圍

- 整體視覺重設計（除了換 UI library 帶來的自然變化）
- 新功能（blog、contact form、analytics 等）— 未來分開 spec
- Monitoring / observability（CloudWatch Logs 預設就有，dashboard / alarm 等以後再加）
- Performance budget、SEO 強化、PWA
- 多語系 i18n（目前單一語言）
- 多環境（staging / preview environments）

---

## 12. 風險與緩解

| 風險 | 緩解 |
|---|---|
| `animal-island-ui` v0.9.4 pre-1.0，可能 breaking change | 鎖死版本 `"animal-island-ui": "0.9.4"`，不用 caret |
| `animal-island-ui` 沒測 React 19 | Phase 0 先建好 smoke test 驗證 Modal / Typewriter |
| Phaser 2 → 4 是不相容重寫 | 視為「重寫」而非「升級」，遊戲資產可重用，code 不可重用 |
| CloudFront Function / OAC / errorResponses 設定錯誤導致無法存取 | Phase 1 用預設 cloudfront.net URL 完整驗證後再切 alias |
| DNS 切換 race window 5-30 分鐘 | 個人網站可接受；Phase 1 充分驗證可縮短 race window 內的問題機率 |
| OIDC role 用 AdministratorAccess 過寬 | 個人專案先求簡單，未來收斂為 CDK execution role only |
| 舊資料遷移錯誤、ResumeSchema 不符 | Phase 0 即驗證；舊 table 1 個月才刪，期間可回頭撈 |

---

## 13. 估計工時

純參考，個人專案進度自己掌握：

| Phase | 內容 | 估時 |
|---|---|---|
| 0 | Monorepo + tooling 設置 | 0.5 天 |
| 0 | `packages/shared`（Zod schema） | 0.5 天 |
| 0 | `apps/api` Nest 骨架 + Resume endpoint + Docker | 1 天 |
| 0 | `apps/api` DDB Local + seed scripts | 0.5 天 |
| 0 | `apps/web` template 拉下、改造 root layout、TanStack Router + Query | 1 天 |
| 0 | Dialogue 系統重寫（FSM + EventBus + 對話樹）| 1.5 天 |
| 0 | Phaser 遊戲場景重寫（資產搬運 + 4 個 scene） | 2-3 天 |
| 0 | Resume page 重做 | 0.5 天 |
| 0 | `infra/` 4 個 stack | 2 天 |
| 0 | GitHub Actions ci/cd + OIDC 第一次部署 | 0.5 天 |
| 0 | 資料遷移 script + seed | 0.5 天 |
| 1-3 | 部署 + 切換 + 驗證 | 0.5 天 |
| **總計** |  | **約 10-12 個工作天** |
