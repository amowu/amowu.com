import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Test } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { ResumeService } from '../src/resume/resume.service'
import { ResumeRepository } from '../src/resume/resume.repository'

describe('ResumeService', () => {
  let service: ResumeService
  let repo: { findOne: ReturnType<typeof vi.fn> }

  beforeEach(async () => {
    repo = { findOne: vi.fn() }
    const moduleRef = await Test.createTestingModule({
      providers: [
        ResumeService,
        { provide: ResumeRepository, useValue: repo },
      ],
    }).compile()
    service = moduleRef.get(ResumeService)
  })

  it('maps DB shape to JSON Resume API contract (strips id/version/updatedAt)', async () => {
    repo.findOne.mockResolvedValue({
      id: 'amowu',
      version: 1,
      updatedAt: '2026-05-30T00:00:00.000Z',
      basics: { name: 'Amo', email: 'a@b.co', profiles: [] },
      work: [],
      volunteer: [],
      education: [],
      awards: [],
      certificates: [],
      publications: [],
      skills: [],
      languages: [],
      interests: [],
      references: [],
      projects: [],
    })
    const result = await service.findOne('amowu')
    expect(result.basics.name).toBe('Amo')
    expect(result.work).toEqual([])
    expect(result).not.toHaveProperty('id')
    expect(result).not.toHaveProperty('version')
    expect(result).not.toHaveProperty('updatedAt')
  })

  it('throws NotFoundException when repo returns null', async () => {
    repo.findOne.mockResolvedValue(null)
    await expect(service.findOne('missing')).rejects.toThrow(NotFoundException)
  })

  it('validates DB data against ResumeSchema (rejects malformed email)', async () => {
    repo.findOne.mockResolvedValue({
      id: 'amowu',
      basics: { name: 'Amo', email: 'not-an-email', profiles: [] },
      work: [], education: [], skills: [], projects: [],
    })
    await expect(service.findOne('amowu')).rejects.toThrow()
  })
})
