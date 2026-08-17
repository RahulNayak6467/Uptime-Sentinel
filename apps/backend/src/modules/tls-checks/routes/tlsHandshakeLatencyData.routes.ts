import express,{ Router } from "express";
import { authMiddleware } from "../../../shared/middleware/auth.middleware";
import { getIndividualTlsData } from "../controllers/individualTlsData.controller";
import { getTlsHandshakeLatency } from "../controllers/tlsHanshakeLatencyData.controller";

const router: Router = express.Router();

router.get("/:monitorId/tls/handshake-latency", authMiddleware, getTlsHandshakeLatency);

export default router;
