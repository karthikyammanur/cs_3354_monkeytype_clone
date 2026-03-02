import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { sanitizeUser } from "../utils/sanitize";

const userService = new UserService();

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getOrCreateUser(req.user!.auth0Id, req.user!.email);
    res.json(sanitizeUser(user));
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.updateUsername(req.user!.auth0Id, req.body.username);
    res.json(sanitizeUser(user));
  } catch (err) {
    next(err);
  }
};
