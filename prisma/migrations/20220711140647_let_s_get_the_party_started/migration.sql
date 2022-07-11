-- CreateTable
CREATE TABLE "Account" (
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "cssURL" TEXT,
    "website" TEXT,
    "github" TEXT,
    "pronouns" TEXT
);

-- CreateTable
CREATE TABLE "Updates" (
    "id" TEXT NOT NULL,
    "postTime" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT,
    "attachments" TEXT[],
    "muxAssetIDs" TEXT[],
    "muxPlaybackIDs" TEXT[],
    "muxAssetStatuses" TEXT,
    "backupAssetID" TEXT,
    "backupPlaybackID" TEXT,
    "isLargeVideo" BOOLEAN,
    "accountUsername" TEXT,

    CONSTRAINT "Updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Accounts.email_unique" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Accounts.username_unique" ON "Account"("username");

-- AddForeignKey
ALTER TABLE "Updates" ADD CONSTRAINT "Updates_accountUsername_fkey" FOREIGN KEY ("accountUsername") REFERENCES "Account"("username") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "Account"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
