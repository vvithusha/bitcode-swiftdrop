-- Add missing cover photo URL field for Item model
ALTER TABLE "Item"
ADD COLUMN "coverPhotoUrl" TEXT NOT NULL DEFAULT '';
