import { Module } from '@nestjs/common'
import { ResumeController } from './resume.controller'
import { ResumeService } from './resume.service'
import { ResumeRepository } from './resume.repository'

@Module({
  controllers: [ResumeController],
  providers: [ResumeService, ResumeRepository],
})
export class ResumeModule {}
