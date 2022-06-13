import type { Event, Timeline, User } from '@prisma/client'
import { prisma } from '~/db.server'

export type { Event } from '@prisma/client'

export function getEventsList({ timelineId }: { timelineId: Timeline['id'] }) {
  return prisma.event.findMany({
    where: { timelineId },
    orderBy: { title: 'desc' },
    select: {
      id: true,
      title: true,
      relatedEvents: true,
      relatedEventsRelation: true
    }
  })
}

export function getEvent({ id }: Pick<Event, 'id'>) {
  return prisma.event.findFirst({
    where: { id },
    include: {
      relatedEvents: {
        select: { id: true, title: true }
      },
      relatedEventsRelation: { select: { id: true, title: true } }
    }
  })
}

export function getEventListItems({
  timelineId
}: {
  timelineId: Timeline['id']
}) {
  return prisma.event.findMany({
    where: { timelineId },

    include: {
      relatedEvents: true,
      relatedEventsRelation: true
    },

    orderBy: { startDate: 'desc' }
  })
}

export function createEvent({
  content,
  startDate,
  timelineId,
  relatedEvents,
  title,
  userId
}: Pick<
  Event,
  'content' | 'relatedEvents' | 'startDate' | 'timelineId' | 'title'
> & {
  userId: User['id']
}) {
  const data = prisma.event.create({
    data: {
      title,
      content,
      startDate,
      timeline: {
        connect: {
          id: timelineId
        }
      },
      user: {
        connect: {
          id: userId
        }
      },
      relatedEvents: {
        connect: [{ id: relatedEvents as Event['id'] }]
        // id: relatedEvents as Event['id']
      }
    },
    include: {
      relatedEvents: true
    }
  })

  return data
}

// await prisma.user.create({
//   data: {
//     name: 'user 1',
//     friends: { create: [{ name: 'user 2' }, { name: 'user 3' }] },
//   },
// })

export function updateEvent({
  id,
  content,
  startDate,
  title,
  userId
}: Pick<Event, 'content' | 'id' | 'startDate' | 'title'> & {
  userId: User['id']
}) {
  return prisma.event.update({
    where: {
      id
    },
    data: {
      title,
      content,
      startDate
    }
  })
}

export function deleteEvent({
  id,
  userId
}: Pick<Event, 'id'> & { userId: User['id'] }) {
  return prisma.event.deleteMany({
    where: { id, userId }
  })
}
