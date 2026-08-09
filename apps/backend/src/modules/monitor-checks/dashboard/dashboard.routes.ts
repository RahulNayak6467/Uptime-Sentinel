import { Router } from "express";
import dashboardOverviewRoutes from "./routes/dashboardoverview.routes";

const router: Router = Router();

router.use("/dashboard/overview", dashboardOverviewRoutes);

export default router;
