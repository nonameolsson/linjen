import type { Timeline, User } from '@prisma/client'
import { prisma } from '~/db.server'

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
  return await prisma.timeline.findMany({
    where: { userId },

    include: {
      _count: {
        select: {
          event: true
        }
      }
    },

    orderBy: { updatedAt: 'desc' }
  })
}

export function createTimeline({
  description,
  title,
  userId,
  imageUrl
}: Pick<Timeline, 'description' | 'title'> &
  Partial<Pick<Timeline, 'imageUrl'>> & {
    userId: User['id']
  }) {
  return prisma.timeline.create({
    data: {
      title,
      description,
      userId: userId,
      imageUrl
    }
  })
}

export function updateTimeline({
  id,
  description,
  title,
  imageUrl
}: // userId //TODO: Verify that the current user is the owner of the timeline
Pick<Timeline, 'id' | 'description' | 'title'> &
  Partial<Pick<Timeline, 'imageUrl'>> & {
    userId: User['id']
  }) {
  return prisma.timeline.update({
    where: {
      id
    },
    data: {
      description,
      title,
      imageUrl
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
