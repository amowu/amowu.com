OPTION="-s $SERVERLESS_STAGE -r $AWS_REGION"

cd src/backend

npm install

serverless resources deploy -p $AWS_PROFILE $OPTION
serverless function deploy -p $AWS_PROFILE $OPTION
serverless endpoint deploy -p $AWS_PROFILE $OPTION --all
