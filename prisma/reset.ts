import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

async function seed() {
  await prisma.timeline.deleteMany();
  console.log("Deleted records in timeline table");

  await prisma.event.deleteMany({});
  console.log("Deleted records in event table");

  await prisma.externalLink.deleteMany({});
  console.log("Deleted records in externalLink table");

  await prisma.user.deleteMany();
  console.log("Deleted records in user table");

  console.log(`Database has been reset. 🌱`)
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


