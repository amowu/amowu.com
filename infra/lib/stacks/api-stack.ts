import * as path from 'node:path'
import { Stack, type StackProps, Duration, CfnOutput } from 'aws-cdk-lib'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2'
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets'
import type * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import type { Construct } from 'constructs'
import { config } from '../config/env'

export interface ApiStackProps extends StackProps {
  readonly resumeTable: dynamodb.ITable
}

export class ApiStack extends Stack {
  readonly httpApi: apigwv2.HttpApi

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props)

    const apiLambda = new lambda.DockerImageFunction(this, 'ApiLambda', {
      functionName: 'amowu-api',
      code: lambda.DockerImageCode.fromImageAsset(
        path.join(__dirname, '../../../'),
        {
          file: 'apps/api/Dockerfile',
          platform: ecr_assets.Platform.LINUX_AMD64,
        },
      ),
      memorySize: 512,
      timeout: Duration.seconds(10),
      environment: {
        // AWS_REGION is reserved by Lambda — it is auto-set based on the function's region.
        DDB_TABLE_NAME: props.resumeTable.tableName,
        CORS_ORIGIN: `https://${config.domain.www}`,
        AWS_LWA_INVOKE_MODE: 'response_stream',
        PORT: '8080',
      },
    })

    props.resumeTable.grantReadData(apiLambda)

    this.httpApi = new apigwv2.HttpApi(this, 'HttpApi', {
      apiName: 'amowu-http-api',
      defaultIntegration: new HttpLambdaIntegration('ApiIntegration', apiLambda),
    })

    new CfnOutput(this, 'HttpApiEndpoint', { value: this.httpApi.apiEndpoint })
  }
}
