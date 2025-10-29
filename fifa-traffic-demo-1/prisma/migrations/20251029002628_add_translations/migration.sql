-- CreateTable
CREATE TABLE "Translation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general'
);

-- CreateIndex
CREATE INDEX "Translation_locale_idx" ON "Translation"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "Translation_key_locale_key" ON "Translation"("key", "locale");
