import { Router } from "express";
import alertEmailRoutes from "./routes/alertEmails.routes";

const router: Router = Router();

router.use("/alert-emails", alertEmailRoutes);

export default router;
