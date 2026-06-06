import { Global, Module } from '@nestjs/common'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { AppConfigService } from '../../config/config.service'
import { DDB_CLIENT } from './dynamodb.tokens'

@Global()
@Module({
  providers: [
    {
      provide: DDB_CLIENT,
      useFactory: (config: AppConfigService) => {
        const region = config.get('AWS_REGION') as string
        const endpoint = config.env.DDB_ENDPOINT
        return new DynamoDBClient({
          region,
          ...(endpoint ? { endpoint } : {}),
        })
      },
      inject: [AppConfigService],
    },
  ],
  exports: [DDB_CLIENT],
})
export class DynamoDBModule {}
