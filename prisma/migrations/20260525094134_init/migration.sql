-- CreateTable
CREATE TABLE "Festival" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "region" TEXT NOT NULL,
    "address" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "category" TEXT NOT NULL,
    "officialUrl" TEXT,
    "imageUrl" TEXT,
    "hasParking" BOOLEAN NOT NULL DEFAULT false,
    "hasShuttle" BOOLEAN NOT NULL DEFAULT false,
    "isPetFriendly" BOOLEAN NOT NULL DEFAULT false,
    "isChildFriendly" BOOLEAN NOT NULL DEFAULT false,
    "congestionStatus" TEXT NOT NULL DEFAULT 'NORMAL',
    "trustScore" INTEGER NOT NULL DEFAULT 50,
    "views" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'NEEDS_REVIEW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FestivalSource" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "festivalId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "FestivalSource_festivalId_fkey" FOREIGN KEY ("festivalId") REFERENCES "Festival" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FestivalProgram" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "festivalId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "time" TEXT,
    "content" TEXT,
    CONSTRAINT "FestivalProgram_festivalId_fkey" FOREIGN KEY ("festivalId") REFERENCES "Festival" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserSubmission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "region" TEXT NOT NULL,
    "address" TEXT,
    "dateRange" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "submitterEmail" TEXT,
    "submitterContact" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
