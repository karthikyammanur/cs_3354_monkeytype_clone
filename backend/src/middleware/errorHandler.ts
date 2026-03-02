import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { InvalidTokenError, UnauthorizedError } from "express-oauth2-jwt-bearer";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/errors";

export const errorHandler = (
  err: Error & { status?: number; type?: string },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (env.NODE_ENV === "development") {
    console.error(err.message, err.stack);
  } else {
    console.error(err.message);
  }

  if (err instanceof InvalidTokenError || err instanceof UnauthorizedError) {
    res.status(401).json({ error: { status: 401, message: "Unauthorized" } });
    return;
  }

  if (err instanceof SyntaxError && err.status === 400 && err.type === "entity.parse.failed") {
    res.status(400).json({ error: { status: 400, message: "Invalid JSON in request body" } });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      res.status(409).json({ error: { status: 409, message: "Resource already exists" } });
      return;
    }
    if (err.code === "P2025") {
      res.status(404).json({ error: { status: 404, message: "Resource not found" } });
      return;
    }
    res.status(500).json({ error: { status: 500, message: "Internal server error" } });
    return;
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({ error: { status: 400, message: "Invalid request data" } });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.status).json({ error: { status: err.status, message: err.message } });
    return;
  }

  if (err.status === 429) {
    res.status(429).json({ error: { status: 429, message: err.message } });
    return;
  }

  const status = err.status ?? 500;
  const message =
    status === 500 && env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message;

  res.status(status).json({ error: { status, message } });
};
