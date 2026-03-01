// Shared type definitions

declare global {
  namespace Express {
    interface Request {
      user?: {
        auth0Id: string;
        email: string;
      };
    }
  }
}

export {};
