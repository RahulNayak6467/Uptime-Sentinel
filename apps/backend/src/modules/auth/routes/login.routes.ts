import express, { Router, Request, Response } from "express";
import { loginUser } from "../controllers/login.controllers";
import { authMiddleware } from "../../../shared/middleware/auth.middleware";

const router: Router = express.Router();

router.post("/", loginUser);

export default router;
