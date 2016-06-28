const IS_LOCAL = process.env.NODE_ENV !== 'production'

const API_INVOKE_URL = IS_LOCAL
  ? 'https://00gdb1h010.execute-api.us-east-1.amazonaws.com/dev'
  : 'https://00gdb1h010.execute-api.us-east-1.amazonaws.com/prod'

export {
  API_INVOKE_URL
}
