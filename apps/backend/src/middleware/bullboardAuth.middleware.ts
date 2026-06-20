import { RequestHandler } from "express";
import basicAuth from "express-basic-auth";
import { env } from "../config/env";

const bullboardAuth: RequestHandler = basicAuth({
  users: {
    [env.BULL_BOARD_USER]: env.BULL_BOARD_PASSWORD,
  },
  challenge: true,
  realm: "Bull Board Admin",
});

export default bullboardAuth;
