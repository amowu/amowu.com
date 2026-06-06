import { describe, it, expect } from 'vitest'
import { EnvSchema } from '../src/config/env.schema'

describe('EnvSchema', () => {
  const valid = {
    PORT: '8080',
    AWS_REGION: 'us-east-1',
    DDB_TABLE_NAME: 'resume-local',
    CORS_ORIGIN: 'http://localhost:5173',
  }

  it('parses valid env', () => {
    expect(() => EnvSchema.parse(valid)).not.toThrow()
  })

  it('coerces PORT to number', () => {
    const parsed = EnvSchema.parse(valid)
    expect(parsed.PORT).toBe(8080)
  })

  it('allows optional DDB_ENDPOINT', () => {
    const withEndpoint = { ...valid, DDB_ENDPOINT: 'http://localhost:8000' }
    const parsed = EnvSchema.parse(withEndpoint)
    expect(parsed.DDB_ENDPOINT).toBe('http://localhost:8000')
  })

  it('rejects missing required field', () => {
    const { AWS_REGION: _, ...invalid } = valid
    expect(() => EnvSchema.parse(invalid)).toThrow()
  })
})
