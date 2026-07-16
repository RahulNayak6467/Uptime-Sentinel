import express, { Router } from "express";
import {
  monitorUrlById,
  updateMonitorStatusById,
} from "../controllers/monitorUrl.controllers";
import { authMiddleware } from "../../../shared/middleware/auth.middleware";
import { removeUrlById } from "../../monitors/controllers/deleteUrl.controllers";
import { updateUrlById } from "../../monitors/controllers/updateUrl.controllers";
import { sendIncidentsById } from "../../incidents/controllers/sendIncidents.controllers";
import { getAllMonitorData } from "../../monitors/controllers/allMonitorData.controllers";

const router: Router = express.Router();

router.post("/:id/check", authMiddleware, monitorUrlById);

router.patch("/:monitorId/status", authMiddleware, updateMonitorStatusById);

router.delete("/:id/delete", authMiddleware, removeUrlById);

router.patch("/:monitorId/update", authMiddleware, updateUrlById);

router.get("/:id/incidents", authMiddleware, sendIncidentsById);

router.get("/data", authMiddleware, getAllMonitorData);

export default router;
