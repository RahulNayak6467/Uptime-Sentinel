import { Router } from "express";
import sseEventRoutes from "./routes/sseEvents";

const router: Router = Router();

router.use("/sse/events", sseEventRoutes);

export default router;
