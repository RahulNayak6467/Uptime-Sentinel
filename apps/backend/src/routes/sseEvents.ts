import express, { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { SSEEvents } from "../controllers/SSE.controller";

const router: Router = express.Router();

router.get("/", authMiddleware, SSEEvents);

export default router;
