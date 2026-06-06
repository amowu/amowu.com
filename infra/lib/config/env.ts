export const config = {
  account: process.env.CDK_DEFAULT_ACCOUNT ?? '',
  region: 'us-east-1',
  domain: {
    apex: 'amowu.com',
    www: 'www.amowu.com',
    hostedZoneName: 'amowu.com',
  },
  certificateArn: '',
  github: {
    owner: 'amowu',
    repo: 'amowu.com',
  },
  tableName: 'resume-prod',
  bucketName: 'amowu-com-prod-web',
}
