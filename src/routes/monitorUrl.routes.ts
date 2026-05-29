import express, { Router } from "express";
import { monitorUrlById } from "../controllers/monitorUrl.controllers";
import { authMiddleware } from "../middleware/auth.middleware";

const router: Router = express.Router();

router.post("/:id/check", authMiddleware, monitorUrlById);

export default router;
