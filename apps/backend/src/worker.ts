import "./config/env";
import { urlCheckWorker } from "./workers/monitorWorkers";
import { emailVerificationWorker } from "./workers/emailVerificationWorker";
import { emailAlertWorker } from "./workers/alertEmailWorker";
import logger from "./config/logger";

process.on("uncaughtException", (err) => {
  logger.error({ err }, "Uncaught exception");
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error({ err }, "Unhandled rejection");
  process.exit(1);
});

logger.info("worker process started");
