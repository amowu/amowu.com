import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ResumeSchema, type Resume } from '@amowu/shared'
import { ResumeRepository } from './resume.repository'

@Injectable()
export class ResumeService {
  constructor(@Inject(ResumeRepository) private readonly repo: ResumeRepository) {}

  async findOne(id: string): Promise<Resume> {
    const item = await this.repo.findOne(id)
    if (!item) throw new NotFoundException(`Resume ${id} not found`)
    const { id: _id, version: _v, updatedAt: _u, ...resume } = item
    return ResumeSchema.parse(resume)
  }
}
