// Request validation middleware using Zod
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema, target: "body" | "query" | "params") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      res.status(400).json({
        error: {
          status: 400,
          message: "Validation error",
          details: result.error.format(),
        },
      });
      return;
    }
    req[target] = result.data;
    next();
  };
};
