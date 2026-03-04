// Data access layer for TypingTest model
import { prisma } from "../config/db";

export class TestRepository {
  create(data: {
    userId: string;
    wpm: number;
    accuracy: number;
    duration: number;
    totalChars: number;
    correctChars: number;
  }) {
    return prisma.typingTest.create({ data });
  }

  async findByUserId(userId: string, options: { page: number; limit: number }) {
    const [results, totalCount] = await Promise.all([
      prisma.typingTest.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip: (options.page - 1) * options.limit,
        take: options.limit,
      }),
      prisma.typingTest.count({ where: { userId } }),
    ]);
    return { results, totalCount };
  }

  async deleteById(testId: string, userId: string) {
    return prisma.typingTest.deleteMany({
      where: { id: testId, userId },
    });
  }

  async getStatsByUserId(userId: string) {
    const agg = await prisma.typingTest.aggregate({
      where: { userId },
      _avg: { wpm: true, accuracy: true },
      _max: { wpm: true },
      _count: true,
    });

    return {
      avgWpm: agg._avg.wpm?.toNumber() ?? 0,
      bestWpm: agg._max.wpm?.toNumber() ?? 0,
      totalTests: agg._count,
      avgAccuracy: agg._avg.accuracy?.toNumber() ?? 0,
    };
  }
}
