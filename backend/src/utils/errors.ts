// Custom application error classes
export class AppError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const notFound = (message = "Not found") => new AppError(message, 404);
export const badRequest = (message = "Bad request") => new AppError(message, 400);
export const unauthorized = (message = "Unauthorized") => new AppError(message, 401);
