/*
  Warnings:

  - You are about to drop the column `userId` on the `location` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `timeline` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `event` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `timeline` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `event` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_location" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "location_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_location" ("createdAt", "id", "title", "updatedAt") SELECT "createdAt", "id", "title", "updatedAt" FROM "location";
DROP TABLE "location";
ALTER TABLE "new_location" RENAME TO "location";
CREATE TABLE "new_timeline" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "timeline_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_timeline" ("createdAt", "description", "id", "title", "updatedAt") SELECT "createdAt", "description", "id", "title", "updatedAt" FROM "timeline";
DROP TABLE "timeline";
ALTER TABLE "new_timeline" RENAME TO "timeline";
CREATE TABLE "new_event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "timelineId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "event_timelineId_fkey" FOREIGN KEY ("timelineId") REFERENCES "timeline" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_event" ("content", "createdAt", "id", "startDate", "timelineId", "title", "updatedAt") SELECT "content", "createdAt", "id", "startDate", "timelineId", "title", "updatedAt" FROM "event";
DROP TABLE "event";
ALTER TABLE "new_event" RENAME TO "event";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
