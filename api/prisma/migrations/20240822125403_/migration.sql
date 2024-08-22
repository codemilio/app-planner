/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `participants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "participants_email_key" ON "participants"("email");
