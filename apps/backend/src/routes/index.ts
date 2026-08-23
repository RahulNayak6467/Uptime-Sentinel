import { Router } from "express";
import healthRouter from "./health.routes";
import authRoutes from "../modules/auth/auth.routes";
import usersRoutes from "../modules/users/users.routes";
import monitorRoutes from "../modules/monitor-checks/monitors/monitors.routes";
import checkRoutes from "../modules/monitor-checks/checks/checks.module.routes";
import incidentRoutes from "../modules/monitor-checks/incidents/incidents.routes";
import dashboardRoutes from "../modules/monitor-checks/dashboard/dashboard.routes";
import alertEmailRoutes from "../modules/monitor-checks/alert-emails/alertEmails.routes";
import sseRoutes from "../sse/sse.routes";
import bullboardAuth from "../shared/middleware/bullboardAuth.middleware";
import { serverAdapter } from "../config/bullboard";

const router: Router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use(monitorRoutes);
router.use(checkRoutes);
router.use(incidentRoutes);
router.use(dashboardRoutes);
router.use(alertEmailRoutes);
router.use(sseRoutes);
router.use("/admin/queues", bullboardAuth, serverAdapter.getRouter());

export default router;
