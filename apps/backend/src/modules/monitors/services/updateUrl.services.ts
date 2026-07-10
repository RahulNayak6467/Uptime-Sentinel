import { db } from "../../../db/index";
import { AppError } from "../../../shared/errors/AppError";
import logger from "../../../config/logger";
import { isPostgresError } from "../../../shared/errors/PostgresError";

export const updateUrl = async (
  url_id: string,
  user_id: string,
  url?: string,
  urlName?: string,
  intervalSeconds?: number,
) => {
  const updates = [];
  const values = [];
  let paramCount = 1;

  if (url) {
    updates.push(`url = $${paramCount++}`);
    values.push(url);
  }
  if (urlName) {
    updates.push(`url_name = $${paramCount++}`);
    values.push(urlName);
  }
  if (intervalSeconds) {
    updates.push(`interval_seconds = $${paramCount++}`);
    values.push(intervalSeconds);
  }
  if (intervalSeconds) {
    updates.push(
      `next_check_at = NOW() + ($${paramCount++} || ' seconds')::interval`,
    );
    values.push(intervalSeconds);
  }

  // add id and user_id for WHERE clause
  values.push(url_id, user_id);

  const update_url_query = `UPDATE monitor SET ${updates.join(", ")} WHERE id = $${paramCount++} AND user_id = $${paramCount}`;

  try {
    const updateUrlAttributes = await db.query(update_url_query, values);
    const rows = updateUrlAttributes.rowCount;
    if (rows === null || rows === 0) {
      throw new AppError(404, "No such url exists", "URL_NOT_FOUND");
    }
    logger.info({ userId: user_id, monitorId: url_id }, "monitor updated");
    return;
  } catch (error) {
    if (error instanceof AppError) {
      return error;
    } else if (error instanceof Error) {
      if (isPostgresError(error) && error.code === "22P02") {
        throw new AppError(400, "Invalid uuid format", "INVALID_UUID");
      }
      throw error;
    }
  }
};
