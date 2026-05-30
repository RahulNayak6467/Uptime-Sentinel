import { db } from "../db/index";
import { ResponseObject } from "../types/types";
import { TIMEOUT } from "../constants/constants";
import { Pool } from "pg";
import { AppError } from "../errors/AppError";
export const checkUrlHealth = async (
  TIMEOUT: number,
  user_id: string,
  url_id: string,
): Promise<ResponseObject> => {
  let response: ResponseObject = {
    status: "UP",
    responseTime: null,
    statusCode: null,
    errorMessage: null,
  };

  try {
    const start = Date.now();

    const getUrl = await db.query("SELECT url FROM monitor where id = $1", [
      url_id,
    ]);
    const url: string = getUrl.rows[0].url;

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
      } else if (err.code === "22P02") {
        throw new AppError(400, "Invalid uuid format");
      } else {
        throw new Error("Internal server error");
      }
    } else {
      throw new Error("Internal server error");
    }
  }
  const { status, responseTime, statusCode, errorMessage } = response;
  //   const client = await db.connect();

  try {
    // await client.query("BEGIN");
    const insert_checks_query =
      //   "INSERT INTO url_checks (url,status,response_time,status_code,error_message,user_id) VALUES ($1, $2, $3, $4, $5, $6)";
      "INSERT INTO url_checks (monitor_id,status,response_time,status_code,error_message) VALUES ($1,$2,$3,$4,$5)";
    const values_checks_query = [
      url_id,
      status,
      responseTime,
      statusCode,
      errorMessage,
    ];
    await db.query(insert_checks_query, values_checks_query);
    console.log(response);
    return response;
  } catch (error) {
    // await client.query("ROLLBACK");
    if (error instanceof AppError) {
      throw error;
    } else if (error instanceof Error) {
      if (error.code === "22P02") {
        throw new Error("Invalid uuid type");
      }
      console.log(error);
      throw new Error("Internal server error");
    }
    throw new Error("Internal server error");
  }
};
