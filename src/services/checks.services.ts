import { AppError } from "../errors/AppError";
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
      return { statusCode: error.statusCode, message: error.message };
    }
    return "Internal server error";
  }
};

export const fetchUrlDataByName = async (query: string) => {
  try {
    const getUrlData = await db.query(query);
    const rows: UrlResponseData[] = getUrlData.rows;
    console.log(rows);
    if (rows.length === 0) {
      //   return res.status(404).json({ message: "no such url exists" });
      throw new AppError(404, "no url exists");
    }
    return rows;
  } catch (error) {
    if (error instanceof AppError) {
      return { statusCode: error.statusCode, message: error.message };
    }

    // return res.status(500).json({ message: "Internal server error" });
    return "Internal server error";
  }
};

export const fetchUrlDataById = async (id: string) => {
  try {
    const getUrlById = await db.query("SELECT * FROM checks WHERE id = $1", [
      id,
    ]);
    const rows: UrlResponseData[] = getUrlById.rows;
    if (rows.length === 0) {
      throw new AppError(404, "no such url exists");
    }
    return rows[0];
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message };
    }
    // if (error instanceof AppError) {
    //   return { status: error.status };
    // }
  }
};
