import "reflect-metadata";
import { initSentry } from "./config/sentry";
initSentry();
import express, { Application } from "express";
import { env } from "./config/env";
import routes from "./routes";
import { scheduleResponseIntoDB } from "./scheduler";
import { handleError } from "./shared/middleware/error.middleware";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsConfigOptions } from "./config/cors";
import { pinoHttp } from "pino-http";
import logger from "./config/logger";
const app: Application = express();
const PORT = env.PORT || 5000;

app.use(pinoHttp({ logger }));
app.use(cors(corsConfigOptions));
app.options("/{*path}", cors(corsConfigOptions));
app.use(cookieParser());
app.use(express.json());

scheduleResponseIntoDB();

app.use(routes);
app.use(handleError);

app.listen(PORT, () => {
  logger.info({ port: PORT }, "Express server started");
});
