import { Module } from '@nestjs/common'
import { ConfigModule } from './config/config.module'
import { DynamoDBModule } from './infra/dynamodb/dynamodb.module'
import { ResumeModule } from './resume/resume.module'

@Module({
  imports: [ConfigModule, DynamoDBModule, ResumeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
