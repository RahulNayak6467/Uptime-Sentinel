import express, { Router } from "express";
import { userLogOut } from "../controllers/logout.controllers";
import { authMiddleware } from "../../../shared/middleware/auth.middleware";

const router: Router = express.Router();

router.post("/", authMiddleware, userLogOut);

export default router;
