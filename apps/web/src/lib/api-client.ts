import type { ZodSchema } from 'zod'

export async function apiFetch<T>(path: string, schema: ZodSchema<T>): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`${path} returned ${res.status}`)
  const json = await res.json()
  return schema.parse(json)
}
