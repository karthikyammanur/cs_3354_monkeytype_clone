// Business logic for word bank operations
import { WordRepository } from "../repositories/word.repository";
import { badRequest } from "../utils/errors";

const wordRepository = new WordRepository();

export class WordService {
  async getRandomWords(count: number) {
    if (count < 1 || count > 500) {
      throw badRequest("Count must be between 1 and 500");
    }
    const words = await wordRepository.getRandomWords(count);
    if (words.length < count) {
      console.warn(`Requested ${count} words but only ${words.length} available in word bank`);
    }
    return words;
  }
}
