import "./config/env";
import { urlCheckWorker } from "./workers/monitorWorkers";
import { emailVerificationWorker } from "./workers/emailVerificationWorker";
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  process.exit(1);
});

console.log("Worker process started");
