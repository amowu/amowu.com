'use strict'

let doc = require('dynamodb-doc')
let dynamo = new doc.DynamoDB()

module.exports.handler = function (event, context, cb) {
  dynamo.getItem({
    TableName: 'amowu-users-dev',
    Key: {
      'userId': event.username
    }
  }, cb)
}
