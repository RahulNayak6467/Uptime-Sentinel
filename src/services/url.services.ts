import { db } from "../index";
import { ResponseObject } from "../types/types";
import { TIMEOUT } from "../constants/constants";
import { Pool } from "pg";
import { AppError } from "../errors/AppError";
export const checkUrlHealth = async (
  url: URL,
  TIMEOUT: number,
  user_id: string,
  urlName: string,
): Promise<ResponseObject> => {
  let response: ResponseObject = {
    status: "UP",
    responseTime: null,
    statusCode: null,
    errorMessage: null,
  };
  try {
    const start = Date.now();

    const getUrlData = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT),
    });
    response = {
      status: "UP",
      responseTime: Date.now() - start,
      statusCode: getUrlData.status,
      errorMessage: null,
    };
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
      if (err.name === "TimeoutError") {
        response = {
          status: "DOWN",
          responseTime: TIMEOUT,
          statusCode: null,
          errorMessage: err.message,
        };
      } else if (err.name === "TypeError") {
        response = {
          status: "DOWN",
          responseTime: null,
          statusCode: null,
          errorMessage: err.message,
        };
      } else {
        throw new Error("Internal server error");
      }
    } else {
      throw new Error("Internal server error");
    }
  }
  const { status, responseTime, statusCode, errorMessage } = response;
  const client = await db.connect();

  try {
    await client.query("BEGIN");
    const insert_checks_query =
      "INSERT INTO checks (url,status,response_time,status_code,error_message,user_id) VALUES ($1, $2, $3, $4, $5, $6)";
    const values_checks_query = [
      url,
      status,
      responseTime,
      statusCode,
      errorMessage,
      user_id,
    ];
    const insertIntoDB = await client.query(
      insert_checks_query,
      values_checks_query,
    );
    const url_exists_query = "SELECT url FROM url_info where url = $1";
    const url_exists_values = [url];
    const checkUrlExists = await client.query(
      url_exists_query,
      url_exists_values,
    );
    const rows = checkUrlExists.rows;
    if (rows.length === 0) {
      if (!urlName) {
        throw new AppError(400, "Enter a valid url name");
      }
      const insert_url_info_query =
        "INSERT INTO url_info (url,url_name,user_id) VALUES ($1, $2, $3)";
      const values_url_info_query = [url, urlName, user_id];
      const insertIntoUrlInfoDB = await client.query(
        insert_url_info_query,
        values_url_info_query,
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    if (error instanceof AppError) {
      throw error;
    } else if (error instanceof Error) {
      console.log(error);
      throw new Error("Internal server error");
    }
    throw new Error("Internal server error");
  } finally {
    client.release();
  }

  return response;
};
