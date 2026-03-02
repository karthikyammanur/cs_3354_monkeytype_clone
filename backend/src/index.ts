// Express application entry point
import "./types";
import { env } from "./config/env";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import userRoutes from "./routes/user.routes";
import testRoutes from "./routes/test.routes";
import wordRoutes from "./routes/word.routes";
import { errorHandler } from "./middleware/errorHandler";
import { generalLimiter, wordsLimiter } from "./middleware/rateLimiter";

const app = express();

app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  helmet({
    contentSecurityPolicy: true,
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    hsts: { maxAge: 31536000, includeSubDomains: true },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);
const allowedOrigins = env.CORS_ORIGIN.split(",").map((s) => s.trim());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(generalLimiter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/users", userRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/words", wordsLimiter, wordRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: { status: 404, message: "Route not found" } });
});

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`TypeShi backend running on port ${env.PORT}`);
});
