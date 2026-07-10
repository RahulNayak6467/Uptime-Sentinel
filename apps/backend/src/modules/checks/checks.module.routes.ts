import { Router } from "express";
import checksRoutes from "./routes/checks.routes";

const router: Router = Router();

router.use("/checks", checksRoutes);

export default router;
