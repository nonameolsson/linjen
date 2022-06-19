import type { Timeline, User } from '@prisma/client';
import { prisma } from '~/db.server';

export type { Timeline } from '@prisma/client';

export function getTimeline({ createdById, id }: { createdById: Timeline['createdById']; id: Timeline['id']}) {
  
  return prisma.timeline.findFirst({
    where: { 
      id,
      createdById
     }
  })
}

export async function getTimelineListItems({ userId }: { userId: User['id'] }) {
  const timelines = await prisma.timeline.findMany({
    where: { createdById: userId },

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
      createdById: userId
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
    where: { id, createdById: userId }
  })
}
