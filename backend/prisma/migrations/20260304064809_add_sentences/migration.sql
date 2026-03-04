-- CreateTable
CREATE TABLE "sentences" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',

    CONSTRAINT "sentences_pkey" PRIMARY KEY ("id")
);
