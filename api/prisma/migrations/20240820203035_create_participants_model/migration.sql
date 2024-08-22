-- CreateTable
CREATE TABLE "participant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "is_owner" BOOLEAN NOT NULL DEFAULT false,
    "trip_id" TEXT NOT NULL,
    CONSTRAINT "participant_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
