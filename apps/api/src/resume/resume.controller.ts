import { Controller, Get, Inject, Param } from '@nestjs/common'
import type { Resume } from '@amowu/shared'
import { ResumeService } from './resume.service'

@Controller('resume')
export class ResumeController {
  constructor(@Inject(ResumeService) private readonly service: ResumeService) {}

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Resume> {
    return this.service.findOne(id)
  }

  @Get()
  findDefault(): Promise<Resume> {
    return this.service.findOne('amowu')
  }
}
