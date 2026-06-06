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
