import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useResume } from '../src/features/resume/useResume'

const wrapper = ({ children }: { children: ReactNode }) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

describe('useResume', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        basics: { name: 'Amo', email: 'a@b.co', profiles: [] },
        work: [],
        education: [],
        skills: [],
        projects: [],
      }),
    })
  })

  it('fetches and returns a Resume', async () => {
    const { result } = renderHook(() => useResume(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.basics.name).toBe('Amo')
  })
})
