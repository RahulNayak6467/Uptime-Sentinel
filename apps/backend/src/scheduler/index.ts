import cron from "node-cron";
import { db } from "../db/index";
import { UrlActiveRowsProps } from "../shared/types/types";
import { addToQueue } from "../queue/monitorQueue";
import logger from "../config/logger";
import createCheckQueue from "../queue/createCheckQueue";

export const scheduleResponseIntoDB = () => {
  const task = cron.schedule("*/30 * * * * *", async () => {
    const query_url_active =
      "SELECT id,user_id,next_check_at from monitor where is_active = true and next_check_at <= NOW()";
    const getUrlActive = await db.query(query_url_active);
    const getUrlActiveRows: UrlActiveRowsProps[] = getUrlActive.rows;
    console.log(getUrlActiveRows);

    const update_next_check =
      "UPDATE monitor SET next_check_at = NOW() + (interval_seconds || ' seconds')::interval WHERE id = $1";

    for (const monitor of getUrlActiveRows) {
      await db.query(update_next_check, [monitor.id]);
      await addToQueue(monitor.user_id, monitor.id);
    }

    // const { id: monitorId, user_id: userId } = getUrlActiveRows[0];

    // logger.info({ monitorId, userId }, "monitor added to the check url queue");
  });

  process.on("SIGTERM", () => {
    logger.info("Shutting down scheduler");
    task.stop();
    process.exit(0);
  });

  process.on("SIGINT", () => {
    logger.info("Shutting down scheduler");
    task.stop();
    process.exit(0);
  });
};
