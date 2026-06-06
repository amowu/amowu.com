import { useQuery } from '@tanstack/react-query'
import { ResumeSchema } from '@amowu/shared'
import { apiFetch } from '../../lib/api-client'

export function useResume(id: string = 'amowu') {
  return useQuery({
    queryKey: ['resume', id],
    queryFn: () => apiFetch(`/api/resume/${id}`, ResumeSchema),
  })
}
