import { NextFunction, Request, Response } from "express";
import { HEART_BEAT } from "../../constants/constants";
import {
  addConnection,
  removeConnection,
} from "../services/sse_connection_management";
import { subscribeUser, unsubscribeUser } from "../../redis/subscriber";
import logger from "../../config/logger";
import { AppError } from "../../shared/errors/AppError";

export const SSEEvents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.user_id;

  try {
    if (!userId) {
      throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }

    res.socket?.setNoDelay(true);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

    const heartBeat = setInterval(() => {
      res.write(`: ping\n\n`);
    }, HEART_BEAT);

    addConnection(userId, res);
    subscribeUser(userId);

    res.on("close", () => {
      logger.debug({ userId: userId }, "SSE connection closed");
      removeConnection(userId, res, async () => {
        await unsubscribeUser(userId);
      });
      clearInterval(heartBeat);
    });
  } catch (err) {
    return next(err);
  }
};
