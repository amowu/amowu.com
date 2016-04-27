[![CircleCI](https://img.shields.io/circleci/project/amowu/resume.svg?style=flat-square)](https://circleci.com/gh/amowu/resume)
[![David](https://img.shields.io/david/amowu/resume.svg?style=flat-square)](https://david-dm.org/amowu/resume)

# Resume

A personal resume that generate by [JSON Resume](https://jsonresume.org/getting-started/).

## Run Locally

Fork and clone repo:

```sh
git clone https://github.com/<YOUR_USER_NAME>/resume.git
```

Install `resume-cli` with npm:

```sh
npm install
```

Run this project locally from the command line:

```sh
npm start
```

Visit the resume page at [http://localhost:4000/](http://localhost:4000/)

## Development

Edit your [Schema](https://jsonresume.org/schema/) in resume.json

## Deploying

Before deploy, run test command for schema validation:

```sh
npm test
```

Export locally to index.html:

```sh
npm run build
```

Push change to your GitHub `gh-pages` branch:

```sh
git push origin gh-pages
```

Congratulations! now you can visit page on [http://YOUR_USER_NAME.github.io/resume/](http://YOUR_USER_NAME.github.io/resume/)