import { Request, Response, NextFunction } from "express";
import { SentenceService } from "../services/sentence.service";

const sentenceService = new SentenceService();

export const getSentences = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { count } = req.query as unknown as { count: number };
    const sentences = await sentenceService.getRandomSentences(count);
    res.json({ sentences });
  } catch (err) {
    next(err);
  }
};
