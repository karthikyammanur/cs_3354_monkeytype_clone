// Word bank API route definitions
import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { getWords } from "../controllers/word.controller";

const router = Router();

const wordQuerySchema = z.object({
  count: z.coerce.number().int().min(1).max(500).default(200),
});

router.get("/", validate(wordQuerySchema, "query"), getWords);

export default router;
