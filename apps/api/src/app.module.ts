import { Module } from '@nestjs/common'
import { ConfigModule } from './config/config.module'
import { DynamoDBModule } from './infra/dynamodb/dynamodb.module'

@Module({
  imports: [ConfigModule, DynamoDBModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
