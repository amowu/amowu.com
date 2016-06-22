'use strict'

// Node.js 4.3 not support destructuring assignment.
// Example: const { SERVERLESS_PROJECT, SERVERLESS_STAGE } = process.env
const SERVERLESS_PROJECT = process.env.SERVERLESS_PROJECT
const SERVERLESS_STAGE = process.env.SERVERLESS_STAGE

let doc = require('dynamodb-doc')
let dynamo = new doc.DynamoDB()

let params = {}
params.TableName = `${SERVERLESS_PROJECT}-users-${SERVERLESS_STAGE}`

module.exports.handler = function (event, context, cb) {
  // event.username = endpoint/users/{username}/resume
  // See more: s-template.json $${readUserResumeApiRequestTemplate}
  params.Key = { userId: event.username }

  dynamo.getItem(params, cb)
}
