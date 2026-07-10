import express, { Router } from 'express';
import {authMiddleware} from "../../../shared/middleware/auth.middleware";
import {getDashboardOverview} from "../controllers/dashboardoverview.controllers";

const router: Router = express.Router();

router.get("/",authMiddleware,getDashboardOverview); // getDashboardOverview

export default router;
