import { db } from "../../../db/index";
import { AppError } from "../../../shared/errors/AppError";
import logger from "../../../config/logger";
import { isPostgresError } from "../../../shared/errors/PostgresError";

export const deleteUrlById = async (url_id: string, user_id: string) => {
  const remove_url_query = "DELETE FROM monitor WHERE id = $1 and user_id = $2";
  const remove_url_value = [url_id, user_id];
  try {
    const deletedRows = await db.query(remove_url_query, remove_url_value);
    const rows = deletedRows.rowCount;
    if (rows === null || rows === 0) {
      throw new AppError(404, "No such url exists", "URL_NOT_FOUND");
    }
    logger.info({ userId: user_id, monitorId: url_id }, "monitor deleted");
    return;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else if (error instanceof Error) {
      if (isPostgresError(error) && error.code === "22P02") {
        throw new AppError(400, "Invalid uuid format", "INVALID_UUID");
      }
      logger.error(
        { err: error, userId: user_id, monitorId: url_id },
        "monitor deletion failed unexpectedly",
      );
      throw error;
    }
  }
};
