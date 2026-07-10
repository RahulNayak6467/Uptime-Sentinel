import express, { Router } from "express";
import {
  monitorUrlById,
  pauseUrlById,
  resumeUrlById,
  updateMonitorStatusById,
} from "../controllers/monitorUrl.controllers";
import { authMiddleware } from "../../../shared/middleware/auth.middleware";
import { removeUrlById } from "../controllers/deleteUrl.controllers";
import { updateUrlById } from "../controllers/updateUrl.controllers";
import { getLastFiveIncidentsData } from "../../incidents/controllers/lastFiveIncidentsData";
import { getAllMonitorData } from "../controllers/allMonitorData.controllers";

const router: Router = express.Router();

router.get("/", authMiddleware, getAllMonitorData);

router.post("/:monitorId/checks", authMiddleware, monitorUrlById);

router.patch("/:monitorId/status", authMiddleware, updateMonitorStatusById);

router.delete("/:monitorId", authMiddleware, removeUrlById);

router.patch("/:monitorId", authMiddleware, updateUrlById);

router.get("/:monitorId/incidents", authMiddleware, getLastFiveIncidentsData);

export default router;
