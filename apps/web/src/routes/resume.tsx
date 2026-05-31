import { createFileRoute } from '@tanstack/react-router'
import { ResumePage } from '../features/resume/ResumePage'

export const Route = createFileRoute('/resume')({
  component: ResumePage,
})
