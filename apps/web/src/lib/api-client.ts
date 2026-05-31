import type { ZodTypeAny, z } from 'zod'

export async function apiFetch<S extends ZodTypeAny>(path: string, schema: S): Promise<z.infer<S>> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`${path} returned ${res.status}`)
  const json = await res.json()
  return schema.parse(json)
}
