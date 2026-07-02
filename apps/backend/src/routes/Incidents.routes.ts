import express, { Router } from "express";
import { getSingleIncidentData } from "../controllers/singleIncidents.controllers";
import { authMiddleware } from "../middleware/auth.middleware";
import { getIncidentsStatsCardData } from "../controllers/incidentsStatsCard.controller";

const router: Router = express.Router();

router.get("/:id", authMiddleware, getSingleIncidentData);

router.get("/all", authMiddleware);

router.get("/all/stats", authMiddleware, getIncidentsStatsCardData);

export default router;
