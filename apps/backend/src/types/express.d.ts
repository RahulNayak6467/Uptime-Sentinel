declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: string;
        email: string;
        jti: string;
        exp: number;
      };
    }
  }
}

export {};
