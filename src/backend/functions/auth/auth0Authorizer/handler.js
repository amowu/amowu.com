'use strict'

const AUTH0_TOKEN_LENGTH = 16
const AuthPolicy = require('aws-auth-policy')
const AuthenticationClient = require('auth0').AuthenticationClient
const auth0 = new AuthenticationClient({
  domain: 'amowu.auth0.com',
  clientId: 'oEmGgFwDWAwQeu3y1qSWgxqFkrmlNduZ'
})

module.exports.handler = function (event, context, callback) {
  console.log('Type: ' + event.type)
  console.log('Authorization Token: ' + event.authorizationToken)
  console.log('Method ARN: ' + event.methodArn)

  authenticate(event)
    .then(context.succeed)
    .catch(error => context.fail(error.message))
}

/**
 * validate the incoming token
 * and produce the principal user identifier associated with the token
 *
 * this could be accomplished in a number of ways:
 * 1. Call out to OAuth provider
 * 2. Decode a JWT token inline
 * 3. Lookup in a self-managed DB
 *
 * you can send a 401 Unauthorized response to the client by failing like so:
 * context.fail("Unauthorized");
 *
 * @param  {Object} params Lambda event object
 * {
 *   type: 'TOKEN',
 *   authorizationToken: /^Bearer (.*)$/,
 *   methodArn: 'arn:aws:execute-api:<REGION>:<ACCOUNT_ID>:<REST_API_ID>/<STAGE>/<METHOD>/<RESOURCE>'
 * }
 * @return {Promise}
 */
const authenticate = function (params) {
  const token = getToken(params)

  let getTokenDataPromise
  if (token.length >= AUTH0_TOKEN_LENGTH) {
    getTokenDataPromise = auth0.tokens.getInfo(token)
  } else {
    throw new TypeError('Bearer token too short: expected >= ' + AUTH0_TOKEN_LENGTH + ' charaters')
  }

  return getTokenDataPromise
    .then(tokenInfo => {
      if (!tokenInfo || !tokenInfo.user_id) {
        throw new Error('No "user_id" returned from Auth0')
      }
      return tokenInfo.user_id
    })
    .then(principalId => generatePolicy(principalId, 'Allow', params.methodArn))
}

const getToken = function (params) {
  if (!params.type || params.type !== 'TOKEN') {
    throw new Error('Expected "event.type" parameter to have value "TOKEN"')
  }

  const tokenString = params.authorizationToken
  if (!tokenString) {
    throw new Error('Expected "event.authorizationToken" parameter to be set')
  }

  const match = tokenString.match(/^Bearer (.*)$/)
  if (!match || match < 2) {
    throw new Error('Invalid Authorization token: ' + tokenString + ' does not match "Bearer .*"')
  }

  return match[1]
}

/**
 * if the token is valid, a policy must be generated which will allow or deny access to the client.
 *
 * if access is allowed, API Gateway will proceed with the backend integration configured on the method that was called.
 *
 * this function must generate a policy that is associated with the recognized principal user identifier.
 * depending on your use case, you might store policies in a DB, or generate them on the fly.
 *
 * keep in mind, the policy is cached for 5 minutes by default (TTL is configurable in the authorizer)
 * and will apply to subsequent calls to any method/resource in the RestApi
 * made with the same token
 *
 * @param  {String} principalId Principal user identifier
 * @param  {String} effect      'Allow' or 'Deny'
 * @param  {String} arn         'arn:aws:execute-api:<REGION>:<ACCOUNT_ID>:<REST_API_ID>/<STAGE>/<METHOD>/<RESOURCE>'
 * @return {Object}             An API Gateway policy object
 * {
 *   "principalId": "<principalId>",
 *   "policyDocument": {
 *     "Version": "2012-10-17",
 *     "Statement": [
 *       {
 *         "Action": "execute-api:Invoke",
 *         "Effect": "<'Allow'|'Deny'>",
 *         "Resource": [
 *           "arn:aws:execute-api:<REGION>:<ACCOUNT_ID>:<REST_API_ID>/<STAGE>/<METHOD>/<RESOURCE>"
 *         ]
 *       }
 *     ]
 *   }
 * }
 */
const generatePolicy = function (principalId, effect, arn) {
  // build apiOptions for the AuthPolicy
  const apiOptions = {}
  const tmp = arn.split(':')
  const apiGatewayArnTmp = tmp[5].split('/')
  const awsAccountId = tmp[4]
  apiOptions.region = tmp[3]
  apiOptions.restApiId = apiGatewayArnTmp[0]
  apiOptions.stage = apiGatewayArnTmp[1]
  const method = apiGatewayArnTmp[2]
  let resource = '/' // root resource
  if (apiGatewayArnTmp[3]) {
    resource += apiGatewayArnTmp[3]
  }

  // the default policy below denies access to all resources in the RestApi
  const policy = new AuthPolicy(principalId, awsAccountId, apiOptions)
  switch (effect) {
    case 'Allow':
      policy.allowMethod(method, resource)
      break
    case 'Deny':
      policy.denyAllMethods()
      break
    default:
      policy.denyAllMethods()
      break
  }

  // finally, build the policy and return the function
  return policy.build()
}
