import { json } from '@remix-run/node'

import type { ActionFunction } from '@remix-run/server-runtime'
import invariant from 'tiny-invariant'
import { deleteExternalLink } from '~/models/externalLink'
import { requireUserId } from '~/session.server'

export const action: ActionFunction = async ({ request }) => {
  console.log('EXTERNAL LINK DELET')
  await requireUserId(request)
  const formData = await request.formData()
  console.log(formData)
  try {
    const id = formData.get('linkId')?.toString()
    invariant(id, 'linkId not found')
    await deleteExternalLink(id)

    return json({ ok: true })
  } catch (error) {
    throw json(error, { status: 400 }) // Unknown error, should not happen
  }
}
