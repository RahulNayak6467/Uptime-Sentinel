import express, {Router} from "express";
import {getMonitorsData} from "../controllers/monitorInfo.controllers";
import {authMiddleware} from "../middleware/auth.middleware";

const router: Router = express.Router();

router.get("/",authMiddleware,getMonitorsData )

export default router;