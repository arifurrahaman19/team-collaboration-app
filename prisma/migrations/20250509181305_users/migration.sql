/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SharedFiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_uploaderId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "_SharedFiles" DROP CONSTRAINT "_SharedFiles_A_fkey";

-- DropForeignKey
ALTER TABLE "_SharedFiles" DROP CONSTRAINT "_SharedFiles_B_fkey";

-- DropTable
DROP TABLE "File";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "_SharedFiles";
