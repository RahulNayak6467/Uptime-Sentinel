import express, { Router } from "express";
import {
  getAllInfo,
  getInfoById,
  getInfoByName,
} from "../controllers/checks.controllers";
import { authMiddleware } from "../middleware/auth.middleware";
import {getMonitorsData} from "../controllers/monitorInfo.controllers";
const router: Router = express.Router();

router.get("/", authMiddleware, getAllInfo);

router.get("/filter", authMiddleware, getInfoByName);

router.get("/:id", authMiddleware, getInfoById);

router.get("/monitor/data",authMiddleware,getMonitorsData )


export default router;
