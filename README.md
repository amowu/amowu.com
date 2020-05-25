# ![](http://i.imgur.com/EgkLVW4.png)[https://amowu.com](https://www.amowu.com)

[![CircleCI](https://img.shields.io/circleci/project/amowu/amowu.com.svg?style=flat-square)](https://circleci.com/gh/amowu/amowu.com)
[![codecov](https://codecov.io/gh/amowu/amowu.com/branch/master/graph/badge.svg)](https://codecov.io/gh/amowu/amowu.com)
[![David](https://img.shields.io/david/amowu/amowu.com.svg?style=flat-square)](https://david-dm.org/amowu/amowu.com)
[![GitHub issues](https://img.shields.io/github/issues/amowu/amowu.com.svg?style=flat-square)](https://overv.io/amowu/amowu.com)
[![Gitter](https://img.shields.io/gitter/room/amowu/amowu.com.svg)](https://gitter.im/amowu/amowu.com)

## Table of contents

- **[Stack](#stack)**
- **[Architecture](#architecture)**
- **[Directory Structure](#directory-structure)**
- **[Development](#development)**

## Stack

### Front-End

- [x] [Vue.js](https://vuejs.org/) - component-based MVVM library
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
  - [x] [AWS Lambda](https://aws.amazon.com/lambda) - microservices
  - [x] [Amazon DynamoDB](https://aws.amazon.com/dynamodb) - NoSQL database
  - [x] [AWS CloudFormation](https://aws.amazon.com/cloudformation) - Infrastructure as a Code

#### Hosting

- [x] [Amazon S3](https://aws.amazon.com/s3) - static website hosting
- [x] [Amazon CloudFront](https://aws.amazon.com/cloudfront) - CDN
- [x] [Amazon Route 53](https://aws.amazon.com/route53) - DNS
- [x] [AWS Certificate Manager](https://aws.amazon.com/certificate-manager) - SSL/TLS credentials

### DevOps

- [x] [GitHub](https://github.com/amowu/amowu.com) - source-code hosting
- [x] [CircleCI](https://circleci.com/gh/amowu/amowu.com) - continuous integration and delivery

#### Monitoring

- [x] [Segment](https://segment.com/) - analytics integrator
  - [x] [Google Analytics](https://www.google.com/analytics/)
- [x] [Apex Ping](https://ping.apex.sh/) - website uptime and performance monitor
- [x] [StatusGator](https://statusgator.com/) - cloud services status monitor
- [ ] DataDog

#### Business Tools

- [x] [overv.io](https://overv.io/amowu/amowu.com) - GitHub issues kanban
- [x] [Slack](https://slack.com/) - group notifications
- [x] [Gitter](https://gitter.im/amowu/amowu.com) - group chat & discuss

## Architecture

🚧

## Directory Structure

```
├── config --------------------------- prod, dev, test env config
├── dist ----------------------------- production bundle
├── resource ------------------------- non-programming source files (ex: Art, Design, ...)
├── scripts -------------------------- automated scripts (ex: Webpack)
├── src
│   ├── backend
│   │   ├── functions
│   │   │   └── ... ------------------ Lambda functions
│   │   │       ├── s-function.json -- Lambda env, settings, API gateway endpoint
│   │   │       └── s-templates.json - API Gateway template
│   │   ├── s-project.json ----------- Serverless plugins
│   │   └── s-resources-cf.json ------ CloudFormation (Infrastructure as a Code)
│   └── frontend
│       ├── actions
│       │   └── ... ------------------ Vuex actions module
│       ├── assets ------------------- source code referenced assets (ex: icon font)
│       ├── components
│       │   └── ... ------------------ Vue presentational components
│       ├── core
│       │   ├── resource.js ---------- vue-resource
│       │   ├── router.js ------------ vue-router
│       │   ├── store.js ------------- Vuex store
│       │   └── type.js -------------- Vuex actions type
│       ├── filters
│       │   └── ... ------------------ Vue filters
│       ├── mutations
│       │   └── ... ------------------ Vuex mutations module
│       ├── pages
│       │   └── ... ------------------ Vue container components
│       ├── phaser-game -------------- Phaser game code
│       │   ├── prefabs
│       │   └── states
│       ├── semantic-ui -------------- Semantic UI custom theme
│       ├── services
│       │   └── ... ------------------ vue-resource module
│       ├── App.vue ------------------ root component
│       └── main.js ------------------ entry point
├── static --------------------------- non-source code referenced assets (ex: favicon)
├── test
│   ├── e2e -------------------------- E2E test spec
│   └── unit ------------------------- unit test spec
├── circle.yml ----------------------- CI & CD
├── index.html
└── package.json
```

## Installation

### Prerequisites

- Node.js v4.3.2

### Setup

Development:

```sh
# install dependencies
$ yarn install

# serve with hot reload at http://localhost:8080
$ yarn run dev
```

Testing:

```sh
# run unit tests
$ yarn run unit

# run e2e tests
$ yarn run e2e

# run all tests
$ yarn test
```

Production:

```sh
# build for production with minification
$ yarn run build
```
