import cron from "node-cron";
import { checkUrlHealth } from "../services/url.services";
import { TIMEOUT } from "../constants/constants";
import { db } from "../db/index";
import { UrlActiveRowsProps } from "../types/types";

const insertResponseIntoDB = async () => {
  try {
    const query_url_active =
      "SELECT id,user_id,next_check_at from monitor where is_active = true and next_check_at <= NOW()";
    const getUrlActive = await db.query(query_url_active);
    const update_url_active_time =
      "UPDATE monitor SET next_check_at = NOW() + (interval_seconds || ' seconds')::interval WHERE id = $1";

    const getUrlActiveRows: UrlActiveRowsProps[] = getUrlActive.rows;
    getUrlActiveRows.forEach(async (url) => {
      try {
        console.log("NEXT_CHECK_AT: ", url.next_check_at);
        await checkUrlHealth(TIMEOUT, url.user_id, url.id);
        await db.query(update_url_active_time, [url.id]);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
        await checkUrlHealth(TIMEOUT, url.user_id, url.id);
        await db.query(update_url_active_time, [url.id]);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const scheduleResponseIntoDB = () => {
  const task = cron.schedule("* * * * *", async () => {
    await insertResponseIntoDB();
  });
  process.on("SIGTERM", () => {
    console.log("Shutting down scheduler...");
    task.stop();
    process.exit(0);
  });

  process.on("SIGINT", () => {
    console.log("Shutting down scheduler...");
    task.stop();
    process.exit(0);
  });
};
