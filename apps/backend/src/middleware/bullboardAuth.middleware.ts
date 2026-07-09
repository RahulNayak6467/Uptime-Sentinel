import { Request, RequestHandler } from "express";
import basicAuth from "express-basic-auth";
import { env } from "../config/env";

const authenticateBullboard = basicAuth({
  users: {
    [env.BULL_BOARD_USER]: env.BULL_BOARD_PASSWORD,
  },
  challenge: true,
  realm: "Bull Board Admin",
  unauthorizedResponse: (req: Request) => {
    req.log.warn("Bull Board authentication failed");
    return "Unauthorized";
  },
});

const bullboardAuth: RequestHandler = (req, res, next) => {
  authenticateBullboard(req, res, () => {
    req.log.debug("Bull Board request authenticated");
    next();
  });
};

export default bullboardAuth;
