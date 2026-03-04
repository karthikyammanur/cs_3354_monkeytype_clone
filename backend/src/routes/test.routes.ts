// Typing test API route definitions
import { Router } from "express";
import { z } from "zod";
import { requireAuth, extractUser } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createTest, getHistory, getStats, deleteTest } from "../controllers/test.controller";

const router = Router();

const createTestSchema = z.object({
  wpm: z.number().positive(),
  accuracy: z.number().min(0).max(100),
  duration: z.number().int().min(1).max(32767),
  totalChars: z.number().positive().int(),
  correctChars: z.number().positive().int(),
});

const historyQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

router.post("/", requireAuth, extractUser, validate(createTestSchema, "body"), createTest);
router.get("/", requireAuth, extractUser, validate(historyQuerySchema, "query"), getHistory);
router.get("/stats", requireAuth, extractUser, getStats);
router.delete("/:id", requireAuth, extractUser, deleteTest);

export default router;
