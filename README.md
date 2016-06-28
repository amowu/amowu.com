# amowu.com

[![CircleCI](https://img.shields.io/circleci/project/amowu/amowu.com.svg?style=flat-square)](https://circleci.com/gh/amowu/amowu.com)
[![David](https://img.shields.io/david/amowu/amowu.com.svg?style=flat-square)](https://david-dm.org/amowu/amowu.com)

- [Gitter](https://gitter.im/amowu/amowu.com)
- [Roadmap](https://overv.io/amowu/amowu.com)

## Stacks

## Architecture

## Directory Structure

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
│       │   ├── router.js ------------ vue-router 的相關配置
│       │   └── store.js ------------- vuex store 的相關配置
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
│       │   └── const.js
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

Presentational 與 Container Components 的差別，詳細可以參考 [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.2wk206zci)。

## Usage
