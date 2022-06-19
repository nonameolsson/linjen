/*
  Warnings:

  - Added the required column `eventId` to the `location` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_location" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    CONSTRAINT "location_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_location" ("createdAt", "createdById", "id", "title", "updatedAt") SELECT "createdAt", "createdById", "id", "title", "updatedAt" FROM "location";
DROP TABLE "location";
ALTER TABLE "new_location" RENAME TO "location";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
