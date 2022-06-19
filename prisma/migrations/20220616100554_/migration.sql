/*
  Warnings:

  - You are about to drop the `_EventToLocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `createdById` on the `event` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_EventToLocation_B_index";

-- DropIndex
DROP INDEX "_EventToLocation_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_EventToLocation";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "LocationsOnEvents" (
    "eventId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,

    PRIMARY KEY ("eventId", "locationId"),
    CONSTRAINT "LocationsOnEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LocationsOnEvents_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "timelineId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "event_timelineId_fkey" FOREIGN KEY ("timelineId") REFERENCES "timeline" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_event" ("content", "createdAt", "id", "startDate", "timelineId", "title", "updatedAt") SELECT "content", "createdAt", "id", "startDate", "timelineId", "title", "updatedAt" FROM "event";
DROP TABLE "event";
ALTER TABLE "new_event" RENAME TO "event";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
