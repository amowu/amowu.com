import { App } from 'aws-cdk-lib'
import { config } from '../lib/config/env'
import { GithubOidcStack } from '../lib/stacks/github-oidc-stack'

const app = new App()
const env = { account: config.account, region: config.region }

new GithubOidcStack(app, 'GithubOidcStack', { env })
