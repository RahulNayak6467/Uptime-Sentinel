import { AppError } from "../errors/AppError";
import { db } from "../index";

export const checkUrlRegistration = async (
  url: string,
  urlName: string,
  intervalSeconds: number,
  user_id: string,
) => {
  try {
    const check_monitor_url =
      "SELECT url from monitor where url = $1 and user_id = $2";
    const check_monitor_value = [url, user_id];
    const check_monitor_rows = await db.query(
      check_monitor_url,
      check_monitor_value,
    );
    if (check_monitor_rows.rows.length !== 0) {
      throw new AppError(409, "The url is already registered");
    }
    const insert_monitor_url =
      "INSERT INTO monitor (url,url_name,interval_seconds,user_id) VALUES($1,$2,$3,$4)";
    const values_monitor_url = [url, urlName, intervalSeconds, user_id];
    await db.query(insert_monitor_url, values_monitor_url);
    return "url successfully registered";
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};
