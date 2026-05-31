import { describe, it, expect } from 'vitest'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { makeResumeEntity } from '../src/resume/resume.entity'

describe('ResumeEntity', () => {
  it('creates entity with primary index on id', () => {
    const client = new DynamoDBClient({ region: 'us-east-1' })
    const entity = makeResumeEntity({ client, tableName: 'test' })
    expect(entity.schema.indexes.primary.pk.composite).toContain('id')
  })

  it('has required attributes', () => {
    const client = new DynamoDBClient({ region: 'us-east-1' })
    const entity = makeResumeEntity({ client, tableName: 'test' })
    expect(entity.schema.attributes).toHaveProperty('id')
    expect(entity.schema.attributes).toHaveProperty('basics')
    expect(entity.schema.attributes).toHaveProperty('work')
    expect(entity.schema.attributes).toHaveProperty('skills')
    expect(entity.schema.attributes).toHaveProperty('projects')
  })
})
