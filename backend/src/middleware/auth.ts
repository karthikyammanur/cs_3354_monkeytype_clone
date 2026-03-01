// Auth0 JWT validation and user extraction middleware
import { auth } from "express-oauth2-jwt-bearer";
import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

export const requireAuth = auth({
  issuerBaseURL: `https://${env.AUTH0_DOMAIN}`,
  audience: env.AUTH0_AUDIENCE,
});

export const extractUser = (req: Request, _res: Response, next: NextFunction) => {
  const payload = req.auth?.payload;
  if (payload?.sub) {
    req.user = {
      auth0Id: payload.sub,
      email: (payload.email as string) ?? "",
    };
  }
  next();
};
