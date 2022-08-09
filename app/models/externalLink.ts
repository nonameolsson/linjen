import type { ExternalLink } from '@prisma/client'
import { prisma } from '~/db.server'

export async function deleteExternalLink(id: ExternalLink['id']) {
  const deletedLink = await prisma.externalLink.delete({
    where: {
      id
    }
  })

  return deletedLink
}
