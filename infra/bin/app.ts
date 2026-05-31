import { App } from 'aws-cdk-lib'
import { config } from '../lib/config/env'
import { GithubOidcStack } from '../lib/stacks/github-oidc-stack'
import { DataStack } from '../lib/stacks/data-stack'

const app = new App()
const env = { account: config.account, region: config.region }

new GithubOidcStack(app, 'GithubOidcStack', { env })
new DataStack(app, 'DataStack', { env })
