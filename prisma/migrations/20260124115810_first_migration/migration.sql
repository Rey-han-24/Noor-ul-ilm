-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "HadithGrade" AS ENUM ('SAHIH', 'HASAN', 'DAIF', 'MAWDU', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "BookmarkType" AS ENUM ('QURAN', 'HADITH');

-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HadithCollection" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameArabic" TEXT NOT NULL,
    "compiler" TEXT NOT NULL,
    "compilerArabic" TEXT,
    "description" TEXT,
    "totalHadiths" INTEGER NOT NULL DEFAULT 0,
    "totalBooks" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HadithCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HadithBook" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "bookNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "nameArabic" TEXT,
    "totalHadiths" INTEGER NOT NULL DEFAULT 0,
    "startNumber" INTEGER,
    "endNumber" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HadithBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hadith" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "bookId" TEXT,
    "hadithNumber" INTEGER NOT NULL,
    "hadithNumberInBook" INTEGER,
    "arabicText" TEXT NOT NULL,
    "englishText" TEXT NOT NULL,
    "urduText" TEXT,
    "narratorChain" TEXT,
    "primaryNarrator" TEXT,
    "primaryNarratorArabic" TEXT,
    "grade" "HadithGrade" NOT NULL DEFAULT 'UNKNOWN',
    "gradedBy" TEXT,
    "gradeNotes" TEXT,
    "reference" TEXT,
    "inBookReference" TEXT,
    "chapterNumber" INTEGER,
    "chapterTitle" TEXT,
    "chapterTitleArabic" TEXT,
    "topics" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hadith_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "BookmarkType" NOT NULL,
    "surahNumber" INTEGER,
    "ayahNumber" INTEGER,
    "collectionId" TEXT,
    "hadithNumber" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "DonationStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "transactionId" TEXT,
    "donorName" TEXT,
    "donorEmail" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "purpose" TEXT,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentPage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "HadithCollection_slug_key" ON "HadithCollection"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "HadithBook_collectionId_bookNumber_key" ON "HadithBook"("collectionId", "bookNumber");

-- CreateIndex
CREATE INDEX "Hadith_collectionId_idx" ON "Hadith"("collectionId");

-- CreateIndex
CREATE INDEX "Hadith_bookId_idx" ON "Hadith"("bookId");

-- CreateIndex
CREATE INDEX "Hadith_grade_idx" ON "Hadith"("grade");

-- CreateIndex
CREATE UNIQUE INDEX "Hadith_collectionId_hadithNumber_key" ON "Hadith"("collectionId", "hadithNumber");

-- CreateIndex
CREATE INDEX "Bookmark_userId_idx" ON "Bookmark"("userId");

-- CreateIndex
CREATE INDEX "Donation_status_idx" ON "Donation"("status");

-- CreateIndex
CREATE INDEX "Donation_createdAt_idx" ON "Donation"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ContentPage_slug_key" ON "ContentPage"("slug");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HadithBook" ADD CONSTRAINT "HadithBook_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "HadithCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hadith" ADD CONSTRAINT "Hadith_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "HadithCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hadith" ADD CONSTRAINT "Hadith_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "HadithBook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
