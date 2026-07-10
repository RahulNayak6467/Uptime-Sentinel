import express, { Router } from "express";
import { checkUserExist } from "../controllers/authMe.controllers";
import { authMiddleware } from "../../../shared/middleware/auth.middleware";


const router: Router = express.Router();

router.get("/", authMiddleware,checkUserExist);

export default router;
