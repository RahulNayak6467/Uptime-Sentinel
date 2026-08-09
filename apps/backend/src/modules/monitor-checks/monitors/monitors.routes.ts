import { Router } from "express";
import individualMonitorRoutes from "./routes/individualMonitor.routes";
import monitorActionRoutes from "./routes/monitorUrl.routes";
import registerMonitorRoutes from "./routes/registerUrl.routes";

const router: Router = Router();

router.use("/monitors", registerMonitorRoutes);
router.use("/monitors", monitorActionRoutes);
router.use("/monitors", individualMonitorRoutes);

export default router;
