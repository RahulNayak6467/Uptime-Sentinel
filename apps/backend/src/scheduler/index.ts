import cron from "node-cron";
import { checkUrlHealth } from "../modules/monitors/services/url.services";
import { TIMEOUT } from "../constants/constants";
import { db } from "../db/index";
import { UrlActiveRowsProps } from "../shared/types/types";
import { addToQueue } from "../queue/monitorQueue";
import { addToDownAlertEmailQueue } from "../queue/alertEmailQueue";
import { runStateMachine } from "../workers/stateMachine.worker";
import logger from "../config/logger";

export const scheduleResponseIntoDB = () => {
  const task = cron.schedule("* * * * *", async () => {
    const query_url_active =
      "SELECT id,user_id,next_check_at from monitor where is_active = true and next_check_at <= NOW()";
    const getUrlActive = await db.query(query_url_active);
    const getUrlActiveRows: UrlActiveRowsProps[] = getUrlActive.rows;
    logger.debug(
      { dueMonitorCount: getUrlActiveRows.length },
      "found due monitors",
    );

    const update_next_check =
      "UPDATE monitor SET next_check_at = NOW() + (interval_seconds || ' seconds')::interval WHERE id = $1";

    for (const monitor of getUrlActiveRows) {
      await db.query(update_next_check, [monitor.id]);
      await addToQueue(TIMEOUT, monitor.user_id, monitor.id);
    }
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
