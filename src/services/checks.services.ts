import { AppError, PostgresError } from "../errors/AppError";
import { db } from "../index";
import { UrlResponseData } from "../types/types";

export const fetchUrlData = async () => {
  try {
    const getAllData = await db.query("select * from checks");
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

export const fetchUrlDataByName = async (url: string) => {
  const query = "SELECT * FROM checks WHERE url = $1";
  const values = [url];

  try {
    const getUrlData = await db.query(query, values);
    const rows: UrlResponseData[] = getUrlData.rows;
    console.log(getUrlData);
    console.log(rows.length);
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

export const fetchUrlDataById = async (id: string) => {
  try {
    const getUrlById = await db.query("SELECT * FROM checks WHERE id = $1", [
      id,
    ]);
    const rows: UrlResponseData[] = getUrlById.rows;
    console.log(rows.length);
    if (rows.length === 0) {
      throw new AppError(404, "no such url exists");
    }
    return rows[0];
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    } else if (error.code === "22P02") {
      throw new AppError(400, "invalid uuid format");
    }
    throw error;
  }
};
