import express, { Router } from "express";
import {
  monitorUrlById,
  pauseUrlById,
  resumeUrlById,
} from "../controllers/monitorUrl.controllers";
import { authMiddleware } from "../middleware/auth.middleware";

const router: Router = express.Router();

router.post("/:id/check", authMiddleware, monitorUrlById);

router.patch("/:id/resume", authMiddleware, resumeUrlById);

router.patch("/:id/pause", authMiddleware, pauseUrlById);

export default router;
