import { json } from '@remix-run/server-runtime'
import type { ZodError } from 'zod'

export function badRequestWithError<T>({
  formPayload,
  error,
  status
}: {
  formPayload: T
  error: ZodError
  status: number
}) {
  return json({ formPayload, error: error.format() }, { status })
}
