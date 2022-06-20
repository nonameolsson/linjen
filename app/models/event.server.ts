import type { Event, Timeline } from '@prisma/client'
import { prisma } from '~/db.server'

export type { Event } from '@prisma/client'

export function getEventsList(timelineId: Timeline['id']) {
  return prisma.event.findMany({
    where: { timelineId },
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
      location: true
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
    orderBy: { startDate: 'desc' },
    include: {
      location: true
    }
  })
}

export async function createEvent({
  data,
  timelineId
}: {
  data: {
    title: Event['title']
    content: Event['content']
    startDate: Event['startDate']
  }
  timelineId: Timeline['id']
}) {
  return await prisma.event.create({
    data: {
      startDate: data.startDate,
      title: data.title,
      content: data.content,
      timeline: {
        connect: {
          id: timelineId
        }
      }
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

export function deleteEvent(id: Event['id']) {
  return prisma.event.delete({
    where: {
      id
    }
  })
}
