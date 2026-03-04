import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import { getSentences } from "../controllers/sentence.controller";

const router = Router();

const sentenceQuerySchema = z.object({
  count: z.coerce.number().int().min(1).max(50).default(10),
});

router.get("/", validate(sentenceQuerySchema, "query"), getSentences);

export default router;
