import express,{ Router } from "express";
import { authMiddleware } from "../../../shared/middleware/auth.middleware";
import { getIndividualTlsData } from "../controllers/individualTlsData.controller";
import { getTlsHistory } from "../controllers/tlsHistory.controllers";

const router: Router = express.Router();

router.get("/:monitorId/tls/history", authMiddleware, getTlsHistory);

export default router;
