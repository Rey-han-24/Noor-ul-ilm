-- CreateTable
CREATE TABLE "ReadingHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "BookmarkType" NOT NULL,
    "surahNumber" INTEGER,
    "ayahNumber" INTEGER,
    "collectionId" TEXT,
    "bookNumber" INTEGER,
    "hadithNumber" INTEGER,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReadingHistory_userId_idx" ON "ReadingHistory"("userId");

-- CreateIndex
CREATE INDEX "ReadingHistory_lastReadAt_idx" ON "ReadingHistory"("lastReadAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingHistory_userId_type_surahNumber_key" ON "ReadingHistory"("userId", "type", "surahNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingHistory_userId_type_collectionId_bookNumber_key" ON "ReadingHistory"("userId", "type", "collectionId", "bookNumber");

-- AddForeignKey
ALTER TABLE "ReadingHistory" ADD CONSTRAINT "ReadingHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
