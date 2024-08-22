/*
  Warnings:

  - You are about to drop the `participant` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "participant";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "participants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "is_owner" BOOLEAN NOT NULL DEFAULT false,
    "trip_id" TEXT NOT NULL,
    CONSTRAINT "participants_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
