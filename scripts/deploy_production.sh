export SERVERLESS_STAGE="prod"

bash scripts/deploy_serverless.sh

aws s3 sync dist s3://$BUCKET_NAME --delete
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DIST_ID --paths /index.html
