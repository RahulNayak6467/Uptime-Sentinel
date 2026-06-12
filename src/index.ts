import { initSentry } from "./config/sentry";
initSentry();
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
import { scheduleResponseIntoDB } from "./scheduler";
import { Pool } from "pg";
import { handleError } from "./middleware/error.middleware";
import { serverAdapter } from "./config/bullboard";
import bullboardAuth from "./middleware/bullboardAuth.middleware";
import emailVerify from "./routes/emailVerification.routes";
import resendOtp from "./routes/resendOTP.routes";
import singleIncidentData from "./routes/singleIncidents.routes";
const app: Application = express();
const PORT = env.PORT || 5000;

app.use(express.json());

scheduleResponseIntoDB();

app.use("/health", healthRouter);
app.use("/url/health", urlHealth);
app.use("/url/checks", checkUrl);
app.use("/user/registration", userCheck);
app.use("/user/email-verify", emailVerify);
app.use("/user/otp-resend", resendOtp);
app.use("/user/login", loginCheck);
app.use("/auth/refresh", authRefresh);
app.use("/auth/logout", logUserOut);
app.use("/url/register", registerUrl);
app.use("/monitor", monitorCheckUrl);
app.use("/incidents", singleIncidentData);
app.use("/admin/queues", bullboardAuth, serverAdapter.getRouter());
app.use(handleError);

app.listen(PORT, () => {
  // console.log(`Server is running at PORT ${PORT}`);
});
