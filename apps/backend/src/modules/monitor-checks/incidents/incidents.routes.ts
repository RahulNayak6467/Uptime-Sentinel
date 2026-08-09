import { Router } from "express";
import incidentsRoutes from "./routes/Incidents.routes";

const router: Router = Router();

router.use("/incidents", incidentsRoutes);

export default router;
