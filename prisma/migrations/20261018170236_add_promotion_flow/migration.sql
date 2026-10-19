-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "branchProductId" TEXT NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_branchProductId_key" ON "Promotion"("branchProductId");

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_branchProductId_fkey" FOREIGN KEY ("branchProductId") REFERENCES "BranchProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
