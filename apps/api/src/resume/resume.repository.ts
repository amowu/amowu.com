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
    @Inject(AppConfigService) config: AppConfigService,
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
