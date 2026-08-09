import express, { Router } from "express";
import { getSingleIncidentData } from "../controllers/singleIncidents.controllers";
import { authMiddleware } from "../../../../shared/middleware/auth.middleware";
import { getIncidentsStatsCardData } from "../controllers/incidentsStatsCard.controller";
import { getAllIncidentsData } from "../controllers/allIncidents.controllers";
import { addIncidentData } from "../controllers/addIncidents.controllers";
import { updateIncidentsData } from "../controllers/updateIncidentData";
import { getIncidentsTimeline } from "../controllers/incidentsTimeline.controllers";

const router: Router = express.Router();

router.get("/", authMiddleware, getAllIncidentsData);

router.get("/stats", authMiddleware, getIncidentsStatsCardData);

router.get("/timeline", authMiddleware, getIncidentsTimeline);

router.get("/:incidentId", authMiddleware, getSingleIncidentData);

router.post("/:incidentId/updates", authMiddleware, addIncidentData);

router.patch("/:incidentId/updates", authMiddleware, updateIncidentsData);

export default router;
