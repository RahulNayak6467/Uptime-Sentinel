import express, { Router } from "express";
import { getSingleIncidentData } from "../controllers/singleIncidents.controllers";
import { authMiddleware } from "../middleware/auth.middleware";

const router: Router = express.Router();

router.get("/:id", authMiddleware, getSingleIncidentData);

router.get("/all",authMiddleware)

router.get("/all/stats",authMiddleware)

export default router;
