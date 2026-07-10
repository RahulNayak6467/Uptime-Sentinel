import { db } from "../db/index";
import { AppError } from "../shared/errors/AppError";
import logger from "../config/logger";

export const pauseUrl = async (url_id: string, user_id: string) => {
  const pause_url_query =
    "UPDATE monitor set is_active = false where id = $1 and user_id = $2";
  const pause_url_value = [url_id, user_id];
  try {
    const isPaused = await db.query(pause_url_query, pause_url_value);
    const rows = isPaused.rowCount;
    if (rows === 0 || null) {
      throw new AppError(404, "no such url exists", "URL_NOT_FOUND");
    }
    logger.info({ userId: user_id, monitorId: url_id }, "monitor paused");
    return;
  } catch (error) {
    throw error;
  }
};

export const resumeUrl = async (url_id: string, user_id: string) => {
  const pause_url_query =
    "UPDATE monitor set is_active = true where id = $1 and user_id = $2";
  const pause_url_value = [url_id, user_id];
  try {
    const isResumed = await db.query(pause_url_query, pause_url_value);
    const rows = isResumed.rowCount;
    if (rows === 0 || null) {
      throw new AppError(404, "no such url exists", "URL_NOT_FOUND");
    }
    logger.info({ userId: user_id, monitorId: url_id }, "monitor resumed");
    return;
  } catch (error) {
    throw error;
  }
};
