STAGE=dev

OPTION="-s $STAGE -r $AWS_REGION"

cd src/backend

serverless resources deploy -p $AWS_PROFILE $OPTION
serverless function deploy -p $AWS_PROFILE $OPTION
serverless endpoint deploy -p $AWS_PROFILE $OPTION
