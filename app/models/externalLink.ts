import type { Event, ExternalLink } from '@prisma/client'
import { prisma } from '~/db.server'

export async function createLink({
  data,
  eventId
}: {
  data: Pick<ExternalLink, 'title' | 'url'>
  eventId: Event['id']
}) {
  await prisma.externalLink.create({
    data: {
      title: data.title,
      url: data.url,
      eventId
    }
  })
}

export async function deleteExternalLink(id: ExternalLink['id']) {
  const deletedLink = await prisma.externalLink.delete({
    where: {
      id
    }
  })

  return deletedLink
}
