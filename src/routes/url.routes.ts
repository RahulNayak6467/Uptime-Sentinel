import express, { Router } from "express";
import { monitorUrl } from "../controllers/url.controllers";
import { authMiddleware } from "../middleware/auth.middleware";
const router: Router = express.Router();

router.post("/", authMiddleware, monitorUrl);
export default router;
