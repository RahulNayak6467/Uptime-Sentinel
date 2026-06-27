import { Request, Response, NextFunction, RequestHandler } from "express";
import { getAllMonitorInfo } from "../services/allMonitorData.services";

export const getAllMonitorData: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user_id = req.user?.user_id;
  const monitor_status = req.query.monitorstatus as string;
  const filter_status = monitor_status ? monitor_status : "all";

  console.log(filter_status);

  try {
    if (!user_id) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    let query: (string | null | boolean)[] = [user_id];

    if (filter_status === "all") {
      query.push(null, null);
    } else if (filter_status !== "paused") {
      query.push(filter_status.toUpperCase(), null);
    } else {
      query.push(null, false);
    }

    const getMonitorData = await getAllMonitorInfo(query);
    return res.status(200).json(getMonitorData);
  } catch (err) {
    return next(err);
  }
};
