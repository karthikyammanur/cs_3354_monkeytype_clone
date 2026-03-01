// Request handlers for word bank endpoints
import { Request, Response, NextFunction } from "express";
import { WordService } from "../services/word.service";

const wordService = new WordService();

export const getWords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { count } = req.query as unknown as { count: number };
    const words = await wordService.getRandomWords(count);
    res.json({ words });
  } catch (err) {
    next(err);
  }
};
