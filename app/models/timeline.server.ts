import type { Timeline, User } from '@prisma/client'

import { prisma } from '~/db.server'

export type { Timeline } from '@prisma/client'

export function getTimeline({
  id,
  userId
}: Pick<Timeline, 'id'> & {
  userId: User['id']
}) {
  return prisma.timeline.findFirst({
    where: { id, userId }
  })
}

export function getTimelineListItems({ userId }: { userId: User['id'] }) {
  const timelines = prisma.timeline.findMany({
    where: { userId },

    include: {
      _count: {
        select: { Event: true }
      }
    },

    orderBy: { updatedAt: 'desc' }
  })

  return timelines
}

export function createTimeline({
  description,
  title,
  userId
}: Pick<Timeline, 'description' | 'title'> & {
  userId: User['id']
}) {
  return prisma.timeline.create({
    data: {
      title,
      description,
      user: {
        connect: {
          id: userId
        }
      }
    }
  })
}

export function updateTimeline({
  id,
  description,
  title
}: // userId //TODO: Verify that the current user is the owner of the timeline
Pick<Timeline, 'id' | 'description' | 'title'> & {
  userId: User['id']
}) {
  return prisma.timeline.update({
    where: {
      id
    },
    data: {
      description,
      title
    }
  })
}

export function deleteTimeline({
  id,
  userId
}: Pick<Timeline, 'id'> & { userId: User['id'] }) {
  return prisma.timeline.deleteMany({
    where: { id, userId }
  })
}
