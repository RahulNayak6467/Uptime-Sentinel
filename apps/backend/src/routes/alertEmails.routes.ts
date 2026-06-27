import express, { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getAlertEmailsData } from "../controllers/alertEmails.controllers";

const router: Router = express.Router();

router.get("/", authMiddleware, getAlertEmailsData);

export default router;
