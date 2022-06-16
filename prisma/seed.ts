import type { Event, Timeline } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const mockEvents: Omit<
  Event,
  'id' | 'updatedAt' | 'createdAt' | 'createdById' | 'timelineId'
>[] = [
  {
    title: 'My first event',
    content: 'The biggest event ever',
    startDate: new Date('2020-01-05')
  },
  {
    title: 'The journey begins',
    content: 'I am so excited',
    startDate: new Date('2020-01-05')
  },
  {
    title: 'I am on my way',
    content: '',
    startDate: new Date('2020-01-08')
  }
]

async function seed() {
  const email = 'demo@user.com'

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  })

  const hashedPassword = await bcrypt.hash('demouser', 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword
        }
      }
    }
  })

  await prisma.timeline.create({
    data: {
      title: 'My first timeline',
      description: 'The biggest timeline ever',
      createdById: user.id
    }
  })

  await prisma.timeline.create({
    data: {
      title: 'My second timeline',
      description: 'The smallest timeline ever',
      createdById: user.id
    }
  })

  const timelines = await prisma.timeline.findMany({
    where: { createdById: user.id }
  })

  await Promise.all(
    timelines.map(async (timeline: Timeline) => {
      mockEvents.map(async event => {
        await prisma.event.create({
          data: {
            title: event.title,
            timelineId: timeline.id,
            startDate: event.startDate,
            createdById: timeline.createdById
          }
        })
      })
    })
  )

  console.log(`Database has been seeded. 🌱`)
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
