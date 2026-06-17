import { RequestHandler } from "express";
import basicAuth from "express-basic-auth";

const bullboardAuth: RequestHandler = basicAuth({
  users: {
    [process.env.BULL_BOARD_USER!]: process.env.BULL_BOARD_PASSWORD || "secret",
  },
  challenge: true,
  realm: "Bull Board Admin",
});

export default bullboardAuth;
