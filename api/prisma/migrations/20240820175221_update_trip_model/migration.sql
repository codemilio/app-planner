-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_trips" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "starts_at" DATETIME NOT NULL,
    "ends_at" DATETIME NOT NULL,
    "destination" TEXT NOT NULL
);
INSERT INTO "new_trips" ("created_at", "destination", "ends_at", "id", "is_confirmed", "starts_at") SELECT "created_at", "destination", "ends_at", "id", "is_confirmed", "starts_at" FROM "trips";
DROP TABLE "trips";
ALTER TABLE "new_trips" RENAME TO "trips";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
