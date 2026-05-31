import { App } from 'aws-cdk-lib'
import { config } from '../lib/config/env'

const app = new App()
const env = { account: config.account, region: config.region }

// Stacks instantiated in subsequent tasks
void app
void env
