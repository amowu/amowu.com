import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
  ResourceNotFoundException,
} from '@aws-sdk/client-dynamodb'

const TABLE_NAME = process.env.DDB_TABLE_NAME ?? 'resume-local'
const client = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:8000',
  credentials: { accessKeyId: 'local', secretAccessKey: 'local' },
})

async function tableExists() {
  try {
    await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }))
    return true
  } catch (e) {
    if (e instanceof ResourceNotFoundException) return false
    throw e
  }
}

async function waitForDdb() {
  const deadline = Date.now() + 30_000
  let lastErr: unknown
  while (Date.now() < deadline) {
    try {
      await tableExists()
      return
    } catch (e) {
      lastErr = e
      await new Promise((r) => setTimeout(r, 500))
    }
  }
  throw lastErr ?? new Error('DDB Local did not become ready within 30s')
}

async function main() {
  await waitForDdb()
  if (await tableExists()) {
    console.log(`Table ${TABLE_NAME} already exists; skipping create.`)
    return
  }
  await client.send(
    new CreateTableCommand({
      TableName: TABLE_NAME,
      KeySchema: [
        { AttributeName: 'pk', KeyType: 'HASH' },
        { AttributeName: 'sk', KeyType: 'RANGE' },
      ],
      AttributeDefinitions: [
        { AttributeName: 'pk', AttributeType: 'S' },
        { AttributeName: 'sk', AttributeType: 'S' },
      ],
      BillingMode: 'PAY_PER_REQUEST',
    }),
  )
  console.log(`Created table ${TABLE_NAME}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
