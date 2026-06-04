import { AppError, PostgresError } from "../errors/AppError";
import { db } from "../db/index";
import { UrlResponseData } from "../types/types";

export const fetchUrlData = async (
  user_id: string,
): Promise<UrlResponseData[]> => {
  try {
    // const query = "select * from url_checks where user_id = $1";
    const query =
      "select c.* from url_checks c inner join monitor m on m.id = c.monitor_id where m.user_id = $1";
    const values = [user_id];
    const getAllData = await db.query(query, values);
    const rows: UrlResponseData[] = getAllData.rows;
    if (rows.length === 0) {
      //   return res.status(200).json({ message: "no request made till now" });
      throw new AppError(200, "no request made till now");
    }
    // return res.status(200).json(rows);
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
  //   const query = "SELECT * FROM checks WHERE url = $1 and user_id = $2";
  const query =
    "SELECT c.* from url_checks c inner join monitor m on c.monitor_id = m.id WHERE url = $1 and user_id = $2";
  const values = [url, user_id];

  try {
    const getUrlData = await db.query(query, values);
    const rows: UrlResponseData[] = getUrlData.rows;
    // console.log(getUrlData);
    // console.log(rows.length);
    if (rows.length === 0) {
      //   return res.status(404).json({ message: "no such url exists" });
      throw new AppError(404, "no url exists");
    }
    return rows;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw error;
  }
};

export const fetchUrlDataById = async (
  id: string,
  user_id: string,
): Promise<UrlResponseData> => {
  try {
    const getUrlById = await db.query(
      "SELECT * FROM url_checks where id = $1",
      [id],
    );
    const rows: UrlResponseData[] = getUrlById.rows;
    // console.log(rows.length);
    if (rows.length === 0) {
      throw new AppError(404, "no such url exists");
    }
    return rows[0];
  } catch (error) {
    // console.log(error);
    if (error instanceof AppError) {
      throw error;
    } else if (error.code === "22P02") {
      throw new AppError(400, "invalid uuid format");
    }
    throw error;
  }
};
