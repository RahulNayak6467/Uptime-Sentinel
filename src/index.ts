import express, { Request, Response, Application } from "express";
import { env } from "./config/env";
import cron from "node-cron";
import healthRouter from "./routes/health.routes";
import urlHealth from "./routes/url.routes";
import checkUrl from "./routes/checks.routes";
import userCheck from "./routes/user.routes";
import loginCheck from "./routes/login.routes";
import authRefresh from "./routes/authRefresh.routes";
import logUserOut from "./routes/logout.routes";
import cronNodeJob from "./routes/demo.routes";
import registerUrl from "./routes/registerUrl.routes";
import monitorCheckUrl from "./routes/monitorUrl.routes";
import { Pool } from "pg";
import { handleError } from "./middleware/error.middleware";
const app: Application = express();
const PORT = env.PORT || 5000;

export const db: Pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB_DATABASENAME,
});

// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/health", healthRouter);
app.use("/url/health", urlHealth);
app.use("/url/checks", checkUrl);
app.use("/user/registration", userCheck);
app.use("/user/login", loginCheck);
app.use("/auth/refresh", authRefresh);
app.use("/auth/logout", logUserOut);
app.use("/url/register", registerUrl);
app.use("/monitor", monitorCheckUrl);
app.use("/cron", cronNodeJob);
// app.use(handleError);

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
