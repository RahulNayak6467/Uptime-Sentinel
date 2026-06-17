import express, { Router } from "express";
import {
  monitorUrlById,
  pauseUrlById,
  resumeUrlById,
} from "../controllers/monitorUrl.controllers";
import { authMiddleware } from "../middleware/auth.middleware";
import { removeUrlById } from "../controllers/deleteUrl.controllers";
import { updateUrlById } from "../controllers/updateUrl.controllers";
import { sendIncidentsById } from "../controllers/sendIncidents.controllers";

const router: Router = express.Router();

router.post("/:id/check", authMiddleware, monitorUrlById);

router.patch("/:id/resume", authMiddleware, resumeUrlById);

router.patch("/:id/pause", authMiddleware, pauseUrlById);

router.delete("/:id/delete", authMiddleware, removeUrlById);

router.patch("/:id/update", authMiddleware, updateUrlById);

router.get("/:id/incidents", authMiddleware, sendIncidentsById);

export default router;
