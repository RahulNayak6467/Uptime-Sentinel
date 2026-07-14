import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/errors/AppError";
import { pauseUrl, resumeUrl } from "../../../scheduler/cronSchedule.services";
import { addToQueue } from "../../../queue/monitorQueue";
import { db } from "../../../db";
import { MonitorConfigurationRow } from "../../../db/db-types";
import { uuidSchema } from "../../../shared/validators/uuidValidation";
import { monitorStatusBodySchema } from "../validations/monitorRequestValidation";

export const updateMonitorStatusById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.user_id;

    if (!userId) {
      throw new AppError(401, "Unauthenticated", "UNAUTHENTICATED");
    }

    const monitorId = uuidSchema.parse(req.params.monitorId);
    const { isActive } = monitorStatusBodySchema.parse(req.body);

    if (isActive) {
      await resumeUrl(monitorId, userId);
    } else {
      await pauseUrl(monitorId, userId);
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

export const monitorUrlById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const url_id = req.params.monitorId as string;
  const user_id = req.user?.user_id;
  if (!user_id) {
    return res.status(401).json({ message: "Unauthenticated" });
  }
  if (!url_id) {
    return res.status(400).json({ message: "Enter valid id " });
  }

  try {
    uuidSchema.parse(url_id);

    const get_monitor_query = `
      SELECT
      id
      FROM monitor
      where id = $1
      AND user_id = $2`;

    const get_monitor_values = [url_id, user_id];

    const getMonitor = await db.query<Pick<MonitorConfigurationRow, "id">>(
      get_monitor_query,
      get_monitor_values,
    );

    const monitor = getMonitor.rows[0];
    if (!monitor) {
      throw new AppError(404, "Monitor not found", "MONITOR_NOT_FOUND");
    }

    const response = await addToQueue(user_id, url_id);
    console.log(response.id);
    return res.status(202).json({
      message: "Check queued",
      jobId: response.id,
      monitorId: url_id,
    });
  } catch (err) {
    next(err);
  }
};
