import { SentenceRepository } from "../repositories/sentence.repository";
import { badRequest } from "../utils/errors";

const sentenceRepository = new SentenceRepository();

export class SentenceService {
  async getRandomSentences(count: number) {
    if (count < 1 || count > 50) {
      throw badRequest("Count must be between 1 and 50");
    }
    return sentenceRepository.getRandomSentences(count);
  }
}
