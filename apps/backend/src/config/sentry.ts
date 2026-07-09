import * as Sentry from "@sentry/node";
import { env } from "./env";

export const initSentry = () => {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
  });
};
