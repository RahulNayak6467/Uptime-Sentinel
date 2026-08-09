import { AppError, PostgresError } from "../../../../shared/errors/AppError";
import { db } from "../../../../db/index";
import { UrlResponseData } from "../../../../shared/types/types";
import logger from "../../../../config/logger";
import { isPostgresError } from "../../../../shared/errors/PostgresError";

export const fetchUrlData = async (
  user_id: string,
): Promise<UrlResponseData[]> => {
  try {
    const query = `
      select m.monitor_name,m.url,m.interval_seconds,c.*
      from url_checks c
      inner join monitor m on m.id = c.monitor_id
      where m.user_id = $1
    `;
    const values = [user_id];
    const getAllData = await db.query(query, values);
    const rows: UrlResponseData[] = getAllData.rows;
    if (rows.length === 0) {
      throw new AppError(200, "no request made till now", "NO_CHECKS_FOUND");
    }

    return rows;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
};

export const fetchUrlDataByName = async (
  url: string,
  user_id: string,
): Promise<UrlResponseData[]> => {
  const query = `
    SELECT c.*
    from url_checks c
    inner join monitor m on c.monitor_id = m.id
    WHERE url = $1 and user_id = $2
  `;
  const values = [url, user_id];

  try {
    logger.debug({ url, userId: user_id }, "fetching checks by url");
    const getUrlData = await db.query(query, values);
    const rows: UrlResponseData[] = getUrlData.rows;
    if (rows.length === 0) {
      throw new AppError(
        404,
        "no checks made till now or url does not exist",
        "CHECKS_NOT_FOUND",
      );
    }
    return rows;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error({ err: error, userId: user_id }, "fetching checks failed");
    throw error;
  }
};

export const fetchUrlDataById = async (
  id: string,
  user_id: string,
): Promise<UrlResponseData[]> => {
  try {
    const query = `
      SELECT c.*
      from url_checks c
      inner join monitor m on c.monitor_id = m.id
      where m.id = $1 and m.user_id = $2
    `;
    const values = [id, user_id];
    const getUrlById = await db.query(query, values);
    const rows: UrlResponseData[] = getUrlById.rows;

    if (rows.length === 0) {
      throw new AppError(
        404,
        "no checks made till now or url does not exist",
        "CHECKS_NOT_FOUND",
      );
    }
    return rows;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    else if (isPostgresError(error) && error.code === "22P02") {
      throw new AppError(400, "invalid uuid format", "INVALID_UUID");
    }
    throw error;
  }
};
