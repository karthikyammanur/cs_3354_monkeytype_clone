import { prisma } from "../config/db";

export class SentenceRepository {
  async getRandomSentences(count: number): Promise<string[]> {
    const rows = await prisma.$queryRaw<{ text: string }[]>`
      SELECT text FROM sentences ORDER BY RANDOM() LIMIT ${count}
    `;
    return rows.map((r) => r.text);
  }

  getTotalCount() {
    return prisma.sentence.count();
  }
}
