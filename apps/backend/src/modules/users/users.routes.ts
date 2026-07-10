import { Router } from "express";
import registrationRoutes from "./routes/user.routes";

const router: Router = Router();

router.use("/", registrationRoutes);

export default router;
