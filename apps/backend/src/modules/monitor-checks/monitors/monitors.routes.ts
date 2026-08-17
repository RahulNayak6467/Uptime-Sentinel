import { Router } from "express";
import individualMonitorRoutes from "./routes/individualMonitor.routes";
import monitorActionRoutes from "./routes/monitorUrl.routes";
import registerMonitorRoutes from "./routes/registerUrl.routes";
import individualTlsRoutes from "../../tls-checks/routes/individualTlsData.routes"
import tlsHandshakeLatencyRoutes from "../../tls-checks/routes/tlsHandshakeLatencyData.routes";
import tlsHistoryRoutes from "../../tls-checks/routes/tlsHistory.routes";

const router: Router = Router();

router.use("/monitors", registerMonitorRoutes);
router.use("/monitors", monitorActionRoutes);
router.use("/monitors", individualMonitorRoutes);
router.use("/monitors", individualTlsRoutes);
router.use("/monitors", tlsHandshakeLatencyRoutes);
router.use("/monitors", tlsHistoryRoutes)

export default router;
