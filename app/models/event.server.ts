import type { Event, Timeline, User } from '@prisma/client'
import { prisma } from '~/db.server'

export type { Event } from '@prisma/client'

export async function getAllEventsForUser(userId: User['id']) {
  const events = await prisma.event.findMany({
    where: {
      userId
    },
    include: {
      timelines: {
        select: {
          title: true,
          id: true
        }
      }
    },
    orderBy: {
      title: 'asc'
    }
  })

  return events
}

export function getEventListForTimeline(timelineId: Timeline['id']) {
  return prisma.event.findMany({
    where: {
      timelines: {
        every: {
          id: timelineId
        }
      }
    },
    orderBy: { title: 'desc' },
    include: {
      _count: true,
      timelines: {
        select: {
          title: true
        }
      },
      location: {
        select: {
          title: true
        }
      }
    }
  })
}

export function getEvent(id: Event['id']) {
  return prisma.event.findFirst({
    where: { id },
    include: {
      referencedBy: true,
      referencing: true,
      location: true,
      timelines: {
        select: {
          title: true,
          id: true
        }
      }
    }
  })
}

export function getEventListItemsForTimeline({
  timelineId
}: {
  timelineId: Timeline['id']
}) {
  return prisma.event.findMany({
    where: {
      timelines: {
        some: {
          id: timelineId
        }
      }
    },
    orderBy: { startDate: 'desc' },
    include: {
      location: true
    }
  })
}

export async function createEvent({
  data,
  timelineId,
  userId
}: {
  data: Pick<Event, 'title' | 'startDate'> & Partial<Pick<Event, 'content'>>
  timelineId: Timeline['id'] | null
  userId: User['id']
}) {
  let connectTimeline = undefined
  if (timelineId) {
    connectTimeline = {
      timelines: {
        connect: {
          id: timelineId
        }
      }
    }
  }

  return await prisma.event.create({
    data: {
      startDate: data.startDate,
      title: data.title,
      content: data.content,
      userId: userId,
      ...connectTimeline
    }
  })
}

export function updateEvent(
  data: Pick<Event, 'title' | 'startDate'> & Partial<Pick<Event, 'content'>>,
  id: Event['id']
) {
  return prisma.event.update({
    where: { id },
    data: {
      content: data.content,
      startDate: data.startDate,
      title: data.title
    }
  })
}

export async function deleteEvent(id: Event['id']) {
  await prisma.event.update({
    data: {
      timelines: {
        set: []
      }
    },
    where: {
      id
    }
  })

  const deletedEvent = await prisma.event.delete({
    where: {
      id
    }
  })

  return deletedEvent
}
