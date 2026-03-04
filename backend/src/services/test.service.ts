// Business logic for typing test operations
import { TestRepository } from "../repositories/test.repository";
import { UserRepository } from "../repositories/user.repository";
import { notFound } from "../utils/errors";

const testRepository = new TestRepository();
const userRepository = new UserRepository();

export class TestService {
  async saveTest(
    auth0Id: string,
    data: { wpm: number; accuracy: number; duration: number; totalChars: number; correctChars: number }
  ) {
    const user = await userRepository.findByAuth0Id(auth0Id);
    if (!user) throw notFound("User not found");

    return testRepository.create({ userId: user.id, ...data });
  }

  async getHistory(auth0Id: string, page: number, limit: number) {
    const user = await userRepository.findByAuth0Id(auth0Id);
    if (!user) throw notFound("User not found");

    const { results, totalCount } = await testRepository.findByUserId(user.id, { page, limit });

    return {
      tests: results,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  async deleteTest(auth0Id: string, testId: string) {
    const user = await userRepository.findByAuth0Id(auth0Id);
    if (!user) throw notFound("User not found");

    const result = await testRepository.deleteById(testId, user.id);
    if (result.count === 0) throw notFound("Test not found");
  }

  async getStats(auth0Id: string) {
    const user = await userRepository.findByAuth0Id(auth0Id);
    if (!user) throw notFound("User not found");

    return testRepository.getStatsByUserId(user.id);
  }
}
