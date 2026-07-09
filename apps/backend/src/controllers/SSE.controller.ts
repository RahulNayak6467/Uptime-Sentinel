import { NextFunction, Request, Response } from "express";
import { HEART_BEAT } from "../constants/constants";
import {
  addConnection,
  removeConnection,
} from "../sse/sse_connection_management";
import { subscribeUser, unsubscribeUser } from "../Redis/subscriber";

export const SSEEvents = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user_id = req.user?.user_id;

  try {
    if (!user_id) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    res.socket?.setNoDelay(true);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

    const heartBeat = setInterval(() => {
      res.write(`: ping\n\n`);
    }, HEART_BEAT);

    addConnection(user_id, res);
    subscribeUser(user_id);

    res.on("close", () => {
      console.log("Connection closed");
      removeConnection(user_id, res, async () => {
        await unsubscribeUser(user_id);
      });
      clearInterval(heartBeat);
    });
  } catch (err) {
    return next(err);
  }
};
