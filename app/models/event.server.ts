import type { Event, Prisma, Timeline, User } from '@prisma/client'
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

// type EventWithRelated = Prisma.FactionGetPayload<{
//   include: { owner: true }
// }>

// const herp: Prisma.EventCreateInput = {}

type FactionWithOwner = Prisma.EventGetPayload<{
  include: { relatedEvents: true }
}>

export async function createEvent({
  data: { startDate, title, content, userId, relatedEvents, timelineId }
}: Prisma.EventCreateArgs) {
  return await prisma.event.create({
    data: {
      title,
      content,
      user: {
        connect: {
          id: userId
        }
      },
      startDate,
      timeline: {
        connect: {
          id: timelineId
        }
      }
    },
    include: {
      relatedEventsRelation: true
    }
  })
  //   data: {
  //     title,
  //     content,
  //     startDate,
  //     timeline: {
  //       connect: {
  //         id: timelineId
  //       }
  //     },
  //     // user: {
  //     //   connect: {
  //     //     id: userId
  //     //   }
  //     // },
  //     // relatedEvents: {
  //     //   connect: [relatedEvents].map((event) => ({ id: } })),
  //     // }
  //   },
  //   include: {
  //     relatedEventsRelation: true
  //   }}

  //   // return prisma.post.update({
  //   //   where: {
  //   //     id,
  //   //   },
  //   //   data: {
  //   //     categories: {
  //   //       connect: [category1, category2].map((cat) => ({ id: cat.id })),
  //   //     },
  //   //   },
  //   //   include: {
  //   //     categories: true,
  //   //   },
  //   // })

  // // const updatedEvent = await prisma.timeline.update({
  // //   where: { id: data.timelineId },
  // //   data: {
  // //     event: { connect: { id: data.id } }
  // //   }
  // // })
  // // console.log('updatedEvent', updatedEvent)
}

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
