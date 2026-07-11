import express, { Router } from 'express';
import {authMiddleware} from "../../../shared/middleware/auth.middleware";

import {getIndividualMonitorStats} from "../controllers/individualMonitor.controllers";
import {getResponseTime} from "../../checks/controllers/responseTime.controllers";
import {getLastLimitChecks} from "../../checks/controllers/lastNchecks.controllers";
import {IndividualMonitorStatsData} from "../controllers/individualMonitorData.controllers";

const router: Router = express.Router();

router.get("/:id/stats",authMiddleware,getIndividualMonitorStats);

router.get("/:id/response-time",authMiddleware,getResponseTime);

router.get("/:id/checks", authMiddleware,getLastLimitChecks);

router.get("/:id/info", authMiddleware,IndividualMonitorStatsData);


export default router;
