// Data access layer for Word model
import { prisma } from "../config/db";

export class WordRepository {
  async getRandomWords(count: number): Promise<string[]> {
    const rows = await prisma.$queryRaw<{ word: string }[]>`
      SELECT word FROM word_bank ORDER BY RANDOM() LIMIT ${count}
    `;
    return rows.map((r) => r.word);
  }

  getTotalCount() {
    return prisma.word.count();
  }
}
