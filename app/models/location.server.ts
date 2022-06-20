import type { Event } from '@prisma/client'
import { prisma } from '~/db.server'

export type { Location } from '@prisma/client'

export async function getLocationsForEvent(id: Event['id']) {
  return await prisma.location.findMany({
    where: {
      events: {
        some: {
          id
        }
      }
    }
  })
}
