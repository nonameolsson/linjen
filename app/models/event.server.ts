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
          title: true
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
      location: true
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
  data: {
    title: Event['title']
    content: Event['content']
    startDate: Event['startDate']
  }
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
  data: {
    title: Event['title']
    content: Event['content']
    startDate: Event['startDate']
  },
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
  console.log('id to delete:', id)
  const deleted = await prisma.event.delete({
    where: {
      id
    }
  })
  console.log(deleted)
  return deleted
}
