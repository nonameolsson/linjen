/*
  Warnings:

  - You are about to drop the column `locationId` on the `event` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_EventToLocation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_EventToLocation_A_fkey" FOREIGN KEY ("A") REFERENCES "event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EventToLocation_B_fkey" FOREIGN KEY ("B") REFERENCES "location" ("id") ON DELETE CASCADE ON UPDATE CASCADE
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
    "createdById" TEXT NOT NULL,
    CONSTRAINT "event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "event_timelineId_fkey" FOREIGN KEY ("timelineId") REFERENCES "timeline" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_event" ("content", "createdAt", "createdById", "id", "startDate", "timelineId", "title", "updatedAt") SELECT "content", "createdAt", "createdById", "id", "startDate", "timelineId", "title", "updatedAt" FROM "event";
DROP TABLE "event";
ALTER TABLE "new_event" RENAME TO "event";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_EventToLocation_AB_unique" ON "_EventToLocation"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToLocation_B_index" ON "_EventToLocation"("B");
