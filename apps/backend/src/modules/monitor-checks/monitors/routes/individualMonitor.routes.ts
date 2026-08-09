import express, { Router } from 'express';
import {authMiddleware} from "../../../../shared/middleware/auth.middleware";

import {getIndividualMonitorStats} from "../controllers/individualMonitor.controllers";
import {getResponseTime} from "../../checks/controllers/responseTime.controllers";
import {getLastLimitChecks} from "../../checks/controllers/lastNchecks.controllers";
import {IndividualMonitorStatsData} from "../controllers/individualMonitorData.controllers";
import { currentMonitorConfig } from '../controllers/currentMonitorConfig.controllers';

const router: Router = express.Router();

router.get("/:monitorId/stats",authMiddleware,getIndividualMonitorStats);

router.get("/:monitorId/response-time",authMiddleware,getResponseTime);

router.get("/:monitorId/checks", authMiddleware,getLastLimitChecks);

router.get("/:monitorId/info", authMiddleware,IndividualMonitorStatsData);

router.get("/:monitorId/edit-options", authMiddleware, currentMonitorConfig);

export default router;
