import { Router } from "express";
import healthRouter from "./health.routes";
import urlHealth from "./url.routes";
import checkUrl from "./checks.routes";
import userCheck from "./user.routes";
import emailVerify from "./emailVerification.routes";
import resendOtp from "./resendOTP.routes";
import loginCheck from "./login.routes";
import authRefresh from "./authRefresh.routes";
import logUserOut from "./logout.routes";
import registerUrl from "./registerUrl.routes";
import monitorCheckUrl from "./monitorUrl.routes";
import singleIncidentData from "./singleIncidents.routes";
import dashboardoverviewRoutes from "./dashboardoverview.routes";
import bullboardAuth from "../middleware/bullboardAuth.middleware";
import { serverAdapter } from "../config/bullboard";
import individualMonitorRoutes from "./individualMonitor.routes";

const router: Router = Router();

router.use("/health", healthRouter);
router.use("/url/health", urlHealth);
router.use("/url/checks", checkUrl);
router.use("/user/registration", userCheck);
router.use("/user/email-verify", emailVerify);
router.use("/user/otp-resend", resendOtp);
router.use("/user/login", loginCheck);
router.use("/auth/refresh", authRefresh);
router.use("/auth/logout", logUserOut);
router.use("/url/register", registerUrl);
router.use("/monitor", monitorCheckUrl);
router.use("/incidents", singleIncidentData);
router.use("/dashboard/overview/stats",dashboardoverviewRoutes )
router.use("/monitors",individualMonitorRoutes)
router.use("/admin/queues", bullboardAuth, serverAdapter.getRouter());

export default router;
