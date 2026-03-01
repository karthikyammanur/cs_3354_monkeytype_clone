// User API route definitions
import { Router } from "express";
import { z } from "zod";
import { requireAuth, extractUser } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { getMe, updateMe } from "../controllers/user.controller";

const router = Router();

const updateUsernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric with underscores only"),
});

router.get("/me", requireAuth, extractUser, getMe);
router.put("/me", requireAuth, extractUser, validate(updateUsernameSchema, "body"), updateMe);

export default router;
