import express,{ Router } from "express";
import { authMiddleware } from "../../../shared/middleware/auth.middleware";
import { getIndividualTlsData } from "../controllers/individualTlsData.controller";

const router: Router = express.Router();

router.get("/:id/tls", authMiddleware, getIndividualTlsData);

export default router;
