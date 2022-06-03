import type { Event, Timeline, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Event } from "@prisma/client";

export function getEvent({ id }: Pick<Event, "id">) {
  return prisma.event.findFirst({
    where: { id },
  });
}

export function getEventListItems({ timelineId }: { timelineId: Timeline["id"] }) {
  return prisma.event.findMany({
    where: { timelineId },
    // select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export function createEvent({
  content,
  endDate,
  startDate,
  timelineId,
  title,
  userId,
}: Pick<Event, "content" | "startDate" | "endDate" | "timelineId" | "title"> & {
  userId: User["id"];
}) {
  return prisma.event.create({
    data: {
      title,
      content,
      endDate,
      startDate,
      timeline: {
        connect: {
          id: timelineId
        }
      },
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function updateEvent({
  id,
  content,
  endDate,
  startDate,
  title,
  userId,
}: Pick<Event, "content" | "id" | "startDate" | "endDate" | "title"> & {
  userId: User["id"];
}) {
  return prisma.event.update({
    where: {
      id
    },
    data: {
      title,
      content,
      endDate,
      startDate,
    },
  });
}

export function deleteEvent({
  id,
  userId,
}: Pick<Event, "id"> & { userId: User["id"] }) {
  return prisma.event.deleteMany({
    where: { id, userId },
  });
}
