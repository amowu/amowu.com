import { readFile } from 'node:fs/promises'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { makeResumeEntity } from '../src/resume/resume.entity'

const TABLE_NAME = process.env.DDB_TABLE_NAME ?? 'resume-local'
const SEED_FILE = new URL('../seeds/resume.json', import.meta.url)

async function main() {
  const client = new DynamoDBClient({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000',
    credentials: { accessKeyId: 'local', secretAccessKey: 'local' },
  })
  const entity = makeResumeEntity({ client, tableName: TABLE_NAME })
  const raw = await readFile(SEED_FILE, 'utf-8')
  const items = JSON.parse(raw)
  for (const item of items) {
    await entity.put(item).go()
    console.log(`Seeded resume ${item.id}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
