-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "auth0_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "typing_tests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "wpm" DECIMAL(65,30) NOT NULL,
    "accuracy" DECIMAL(65,30) NOT NULL,
    "duration" INTEGER NOT NULL,
    "total_chars" INTEGER NOT NULL,
    "correct_chars" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "typing_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "word_bank" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,

    CONSTRAINT "word_bank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_auth0_id_key" ON "users"("auth0_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "typing_tests_user_id_created_at_idx" ON "typing_tests"("user_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "word_bank_word_key" ON "word_bank"("word");

-- AddForeignKey
ALTER TABLE "typing_tests" ADD CONSTRAINT "typing_tests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
