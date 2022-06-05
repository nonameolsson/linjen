import type { Event, Timeline, User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Event } from "@prisma/client";

export function getEvent({ id }: Pick<Event, "id">) {
  return prisma.event.findFirst({
    where: { id },
    // select: { locations: true, id: true, title: true, content: true }
  });
}

export function getEventListItems({
  timelineId,
}: {
  timelineId: Timeline["id"];
}) {
  return prisma.event.findMany({
    where: { timelineId },
    // select: { id: true, title: true },
    orderBy: { startDate: "desc" },
  });
}

export function createEvent({
  content,
  startDate,
  timelineId,
  title,
  userId,
}: Pick<Event, "content" | "startDate" | "timelineId" | "title"> & {
  userId: User["id"];
}) {
  return prisma.event.create({
    data: {
      title,
      content,
      startDate,
      timeline: {
        connect: {
          id: timelineId,
        },
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
  startDate,
  title,
  userId,
}: Pick<Event, "content" | "id" | "startDate" | "title"> & {
  userId: User["id"];
}) {
  return prisma.event.update({
    where: {
      id,
    },
    data: {
      title,
      content,
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
