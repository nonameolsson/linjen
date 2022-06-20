import type { Timeline } from '@prisma/client'
import { prisma } from '~/db.server'
import type { User } from './user.server'

export type { Timeline } from '@prisma/client'

export function getTimeline({
  userId,
  id
}: {
  userId: Timeline['userId']
  id: Timeline['id']
}) {
  return prisma.timeline.findFirst({
    where: {
      id,
      userId
    }
  })
}

export async function getTimelineListItems({ userId }: { userId: User['id'] }) {
  const timelines = await prisma.timeline.findMany({
    where: { userId },

    include: {
      _count: {
        select: { event: true }
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
      userId: userId
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
    where: { id, userId: userId }
  })
}
