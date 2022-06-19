import type { Event } from '@prisma/client'
import { prisma } from '~/db.server'

export type { Location } from '@prisma/client'

export async function getLocationsForEvent(id: Event['id']) {
  const locationIds = await prisma.locationEvent.findMany({
    where: { eventId: id },
    include: { event: { include: { _count: true } } }
  })
  console.log(locationIds)
  // const locations = await prisma.location.findMany({
  //   where: { id: locationIds[0].locationId },
  //   include: { _count: true }
  // })

  return undefined
}
