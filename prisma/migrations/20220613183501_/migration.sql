/*
  Warnings:

  - You are about to alter the column `startDate` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- CreateTable
CREATE TABLE "_relatedEvents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_relatedEvents_A_fkey" FOREIGN KEY ("A") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_relatedEvents_B_fkey" FOREIGN KEY ("B") REFERENCES "Event" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "timelineId" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Event_timelineId_fkey" FOREIGN KEY ("timelineId") REFERENCES "Timeline" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("content", "createdAt", "id", "startDate", "timelineId", "title", "updatedAt", "userId") SELECT "content", "createdAt", "id", "startDate", "timelineId", "title", "updatedAt", "userId" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_relatedEvents_AB_unique" ON "_relatedEvents"("A", "B");

-- CreateIndex
CREATE INDEX "_relatedEvents_B_index" ON "_relatedEvents"("B");
