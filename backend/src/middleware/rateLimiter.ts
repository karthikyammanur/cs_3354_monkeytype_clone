// Rate limiting middleware configurations
import rateLimit from "express-rate-limit";
import { env } from "../config/env";

export const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { status: 429, message: "Too many requests, please try again later" } },
});

export const wordsLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { status: 429, message: "Too many requests, please try again later" } },
});
