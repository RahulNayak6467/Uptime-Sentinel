import express, { Router } from "express";
import { registerUrl } from "../controllers/registerUrl.controllers";
import { authMiddleware } from "../../../../shared/middleware/auth.middleware";

const router: Router = express.Router();
router.post("/", authMiddleware, registerUrl);

export default router;
