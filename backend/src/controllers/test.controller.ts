import { Request, Response, NextFunction } from "express";
import { TestService } from "../services/test.service";
import { badRequest } from "../utils/errors";
import { sanitizeTest } from "../utils/sanitize";

const testService = new TestService();

export const createTest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.correctChars > req.body.totalChars) {
      throw badRequest("correctChars cannot exceed totalChars");
    }
    const test = await testService.saveTest(req.user!.auth0Id, req.body);
    res.status(201).json(sanitizeTest(test));
  } catch (err) {
    next(err);
  }
};

export const getHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = req.query as unknown as { page: number; limit: number };
    const result = await testService.getHistory(req.user!.auth0Id, page, limit);
    res.json({
      tests: result.tests.map(sanitizeTest),
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await testService.getStats(req.user!.auth0Id);
    res.json(stats);
  } catch (err) {
    next(err);
  }
};
