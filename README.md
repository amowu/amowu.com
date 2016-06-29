# ![](http://i.imgur.com/EgkLVW4.png)[https://amowu.com](https://www.amowu.com)

[![CircleCI](https://img.shields.io/circleci/project/amowu/amowu.com.svg?style=flat-square)](https://circleci.com/gh/amowu/amowu.com)
[![David](https://img.shields.io/david/amowu/amowu.com.svg?style=flat-square)](https://david-dm.org/amowu/amowu.com)
[![GitHub issues](https://img.shields.io/github/issues/amowu/amowu.com.svg?style=flat-square)](https://overv.io/amowu/amowu.com)
[![Gitter](https://img.shields.io/gitter/room/amowu/amowu.com.svg)](https://gitter.im/amowu/amowu.com)

## Table of contents

- **[Stack](#stack)** - 列出使用的工具＆技術鏈<br/>
- **[Architecture](#architecture)**<br/>
- **[Directory Structure](#directory-structure)** - 列出資料夾與檔案的結構<br/>
- **[Development](#development)** - 介紹如何安裝與開發

## Stack

![](http://i.imgur.com/ISEoB3u.png) 下面列出這個專案所使用到的工具鏈與技術鏈，並依照 Front-End、Back-End 與 DevOps 作分類：

### Front-End

- [x] [Vue.js](https://vuejs.org/) - Component-based MVVM library
  - [x] [vue-router](https://github.com/vuejs/vue-router)
  - [x] [vue-resource](https://github.com/vuejs/vue-resource)
- [x] [Vuex](https://github.com/vuejs/vuex) - Flux application architecture for Vue.js
  - [x] [vue-router-sync](https://github.com/vuejs/vuex-router-sync)
- [x] [Semantic UI](http://semantic-ui.com/) - UI, responsive layouts
- [x] [Phaser](http://phaser.io/) - HTML5 Game Framework

#### Tools

- [x] [Webpack](https://webpack.github.io/) - JavaScript build tool, task runner
- [x] [Babel](https://babeljs.io/) - JavaScript compiler
- [x] [ESLint](http://eslint.org/) - JavaScript linter
- [ ] [Flow](https://flowtype.org/) - JavaScript static type checker

### Back-End

- [x] [Serverless Framework](http://serverless.com/)
  - [x] [Amazon API Gateway](https://aws.amazon.com/api-gateway) - RESTful APIs endpoint
  - [x] [AWS Lambda](https://aws.amazon.com/lambda) - Microservices
  - [x] [Amazon DynamoDB](https://aws.amazon.com/dynamodb) - NoSQL database
  - [x] [AWS CloudFormation](https://aws.amazon.com/cloudformation) - Infrastructure as code

#### Hosting

- [x] [Amazon S3](https://aws.amazon.com/s3) - Static website hosting
- [x] [Amazon CloudFront](https://aws.amazon.com/cloudfront) - CDN
- [x] [Amazon Route 53](https://aws.amazon.com/route53) - DNS
- [x] [AWS Certificate Manager](https://aws.amazon.com/certificate-manager) - SSL/TLS credentials

### DevOps

- [x] [GitHub](https://github.com/amowu/amowu.com) - Source-code hosting
- [x] [CircleCI](https://circleci.com/gh/amowu/amowu.com) - Continuous integration and delivery

#### Monitoring

- [x] [Segment](https://segment.com/) - Analytics integrator
  - [x] [Google Analytics](https://www.google.com/analytics/)
- [x] [Apex Ping](https://ping.apex.sh/) - Website uptime and performance monitor
- [x] [StatusGator](https://statusgator.com/) - Cloud services status monitor

#### Business Tools

- [x] [overv.io](https://overv.io/amowu/amowu.com) - GitHub issues kanban
- [x] [Slack](https://slack.com/) - Group notifications
- [x] [Gitter](https://gitter.im/amowu/amowu.com) - Group chat

## Architecture

🚧

## Directory Structure

![](http://i.imgur.com/a5SHBxe.png) 列出一些組織結構，並介紹主要的資料夾及檔案的作用：

```
├── dist ----------------------------- 勿動！用來存放 build 完的 production frontend SPA files
├── resource ------------------------- 存放一些與原始碼建置無關的資源檔案（例如：遊戲地圖美術原始擋）
├── scripts -------------------------- 存放一些與 Webpack、CI、CD 相關的腳本程式
├── src
│   ├── backend ---------------------- 使用 Serverless framework 建立的 Microservices 架構
│   │   ├── functions
│   │   │   └── ... ------------------ functions 用來存放每一支各自獨立的 AWS Lambda Function
│   │   │       ├── s-function.json -- 設定 Lmabda 的環境變數、Serverless plugins、AWS API Gateway endpoint
│   │   │       └── s-templates.json - AWS API Gateway Request and Response mapping template
│   │   ├── s-project.json ----------- Serverless project setting, plugins installation
│   │   └── s-resources-cf.json ------ AWS CloudFormation 的 Infrastructure as Code，自動化建立 IAM Role 與 DynamoDB
│   └── frontend --------------------- 前端架構主要使用 Vue.js 與 Vuex，UI 使用 Semantic UI，遊戲引擎使用 Phaser
│       ├── assets ------------------- 存放原始碼會需要用到的靜態資源擋（例如：CSS 的各式圖檔、遊戲素材），build 的時候會根據 Webpack 設定轉換為 inline or base64 encoding assets
│       ├── core
│       │   ├── config.js ------------ 一些給前端用的相關配置（例如：API_INVOKE_URL）
│       │   ├── resources.js --------- vue-resource 的相關配置
│       │   └── router.js ------------ vue-router 的相關配置
│       ├── phaser-game -------------- 存放遊戲相關的程式碼，based on Phaser HTML5 game framework
│       │   ├── prefabs
│       │   └── states
│       ├── semantic-ui -------------- Semantic UI 的相關配置
│       ├── vue
│       │   ├── components ----------- Presentational Components，負責 markup 與 styles，只從 props 讀取資料與呼叫 callbacks
│       │   ├── filters
│       │   └── views ---------------- Container Components，負責與 backend 溝通、訂閱 Vuex store state、Dispatch Vuex actions、更新 Vue component state
│       ├── vuex
│       │   ├── actions
│       │   ├── mutations
│       │   ├── const.js
│       │   └── store.js
│       └── main.js
├── static --------------------------- 存放原始碼不會用到的靜態資源擋（例如：favicon），build production 的時候，static 會被直接複製一份至 dist 資料夾底下
├── test
│   ├── e2e
│   └── unit
├── circle.yml
├── config.js
├── index.html
└── package.json
```

- Presentational Components 與 Container Components 的差別，詳細請參考 [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.2wk206zci)。

## Development

![](http://i.imgur.com/Bjir8Xg.png) 開發文件，介紹開發前的準備事項、如何安裝與運行、以及其它詳細文件：

### Prerequisites

- [Node.js](https://nodejs.org/en/) v4.3.2 以上

### Installation

Clone 一份 repository 在本機端：

```sh
$ git clone https://github.com/amowu/amowu.com.git
```

進入資料夾底下，或是 `cd amowu.com`，然後安裝 dependencies：

```sh
$ npm install
```

運行本地端 server，打開瀏覽器 [http://localhost:8080](http://localhost:8080) 看結果：

```sh
$ npm run dev
```

### Task

列出所有可以使用的命令：

| Command | Description |
| --- | --- |
| `npm test` | 依序執行 `npm run test:lint` |
| `npm run test:lint` | 執行 ESLint 檢查程式碼風格 |
| `npm run dev` | 運行本地端 development server，http://localhost:8080 |
| `npm run build` | 打包 production 原始碼至 dist 資料夾 |
