import { Stack, type StackProps, RemovalPolicy } from 'aws-cdk-lib'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import type { Construct } from 'constructs'
import { config } from '../config/env'

export class DataStack extends Stack {
  readonly resumeTable: dynamodb.ITable

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    this.resumeTable = new dynamodb.Table(this, 'ResumeTable', {
      tableName: config.tableName,
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
    })
  }
}
