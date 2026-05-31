import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Test } from '@nestjs/testing'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { ResumeRepository } from '../src/resume/resume.repository'
import { DDB_CLIENT } from '../src/infra/dynamodb/dynamodb.tokens'
import { AppConfigService } from '../src/config/config.service'

describe('ResumeRepository', () => {
  let repo: ResumeRepository

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ResumeRepository,
        { provide: DDB_CLIENT, useValue: new DynamoDBClient({ region: 'us-east-1' }) },
        { provide: AppConfigService, useValue: { env: { DDB_TABLE_NAME: 'test' } } },
      ],
    }).compile()
    repo = moduleRef.get(ResumeRepository)
  })

  it('exposes a findOne method', () => {
    expect(typeof repo.findOne).toBe('function')
  })

  it('findOne calls ElectroDB get with id', async () => {
    const spy = vi.spyOn(repo['entity'], 'get').mockReturnValue({
      go: async () => ({
        data: {
          id: 'amowu',
          basics: { name: 'A', email: 'a@b.c', profiles: [] },
          work: [],
          education: [],
          skills: [],
          projects: [],
        },
      }),
    } as never)
    const result = await repo.findOne('amowu')
    expect(spy).toHaveBeenCalledWith({ id: 'amowu' })
    expect(result?.id).toBe('amowu')
  })

  it('findOne returns null when not found', async () => {
    vi.spyOn(repo['entity'], 'get').mockReturnValue({
      go: async () => ({ data: null }),
    } as never)
    const result = await repo.findOne('nonexistent')
    expect(result).toBeNull()
  })
})
