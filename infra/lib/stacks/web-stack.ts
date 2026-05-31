import * as path from 'node:path'
import { Stack, type StackProps, RemovalPolicy, Fn, CfnOutput } from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as route53_targets from 'aws-cdk-lib/aws-route53-targets'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import type * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2'
import type { Construct } from 'constructs'
import { config } from '../config/env'

export interface WebStackProps extends StackProps {
  readonly httpApi: apigwv2.HttpApi
}

export class WebStack extends Stack {
  constructor(scope: Construct, id: string, props: WebStackProps) {
    super(scope, id, props)

    const bucket = new s3.Bucket(this, 'WebBucket', {
      bucketName: config.bucketName,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.RETAIN,
    })

    const zone = route53.HostedZone.fromLookup(this, 'Zone', {
      domainName: config.domain.hostedZoneName,
    })

    // Cert is optional during initial deploy; the alias attachment is commented out below.
    // When the real certArn is available, set config.certificateArn and uncomment.
    const cert = config.certificateArn
      ? acm.Certificate.fromCertificateArn(this, 'Cert', config.certificateArn)
      : undefined

    const apexRedirect = new cloudfront.Function(this, 'ApexRedirect', {
      code: cloudfront.FunctionCode.fromInline(`
        function handler(event) {
          var host = event.request.headers.host.value;
          if (host === '${config.domain.apex}') {
            return {
              statusCode: 301,
              statusDescription: 'Moved Permanently',
              headers: { location: { value: 'https://${config.domain.www}' + event.request.uri } }
            };
          }
          return event.request;
        }
      `),
    })

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [
          { function: apexRedirect, eventType: cloudfront.FunctionEventType.VIEWER_REQUEST },
        ],
      },
      additionalBehaviors: {
        '/api/*': {
          origin: new origins.HttpOrigin(
            Fn.select(2, Fn.split('/', props.httpApi.apiEndpoint)),
          ),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        },
      },
      // ALIAS + CERT INTENTIONALLY COMMENTED — uncomment during Phase 14 cutover
      // domainNames: [config.domain.www, config.domain.apex],
      // certificate: cert,
      defaultRootObject: 'index.html',
      errorResponses: [
        { httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/index.html' },
        { httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/index.html' },
      ],
    })

    new s3deploy.BucketDeployment(this, 'DeployWeb', {
      sources: [s3deploy.Source.asset(path.join(__dirname, '../../../apps/web/dist'))],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
    })

    // Route53 records — left for cutover step (Phase 14)
    // new route53.ARecord(this, 'AliasWww', {
    //   zone, recordName: 'www',
    //   target: route53.RecordTarget.fromAlias(new route53_targets.CloudFrontTarget(distribution)),
    // })
    // new route53.ARecord(this, 'AliasApex', {
    //   zone, recordName: config.domain.apex,
    //   target: route53.RecordTarget.fromAlias(new route53_targets.CloudFrontTarget(distribution)),
    // })

    new CfnOutput(this, 'DistributionDomainName', { value: distribution.distributionDomainName })
    new CfnOutput(this, 'BucketName', { value: bucket.bucketName })

    // Quiet "unused" warnings for things used after cutover uncomment
    void cert
    void zone
    void route53_targets
  }
}
