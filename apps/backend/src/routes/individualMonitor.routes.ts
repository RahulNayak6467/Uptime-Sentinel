import express, { Router } from 'express';
import {authMiddleware} from "../middleware/auth.middleware";

import {getIndividualMonitorStats} from "../controllers/individualMonitor.controllers";

const router: Router = express.Router();

router.get("/:id/stats",authMiddleware,getIndividualMonitorStats);

export default router;
