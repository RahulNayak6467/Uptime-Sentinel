import express, { Router } from "express";
import { getSingleIncidentData } from "../controllers/singleIncidents.controllers";
import { authMiddleware } from "../middleware/auth.middleware";
import { getIncidentsStatsCardData } from "../controllers/incidentsStatsCard.controller";
import { getAllIncidentsData } from "../controllers/allIncidents.controllers";
import { addIncidentData } from "../controllers/addIncidents.controllers";
import { updateIncidentsData } from "../controllers/updateIncidentData";
import { getIncidentsTimeline } from "../controllers/incidentsTimeline.controllers";

const router: Router = express.Router();

// router.get("/:id", authMiddleware, getSingleIncidentData);

router.get("/all", authMiddleware, getAllIncidentsData);

router.get("/all/stats", authMiddleware, getIncidentsStatsCardData);

router.post("/:incidentId/insert", authMiddleware, addIncidentData);

router.patch("/:incidentId/updates", authMiddleware, updateIncidentsData);

router.get("/timeline", authMiddleware, getIncidentsTimeline);

export default router;
