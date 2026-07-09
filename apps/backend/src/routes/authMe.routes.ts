import express, { Router } from "express";
import { checkUserExist } from "../controllers/authMe.controllers";
import { authMiddleware } from "../middleware/auth.middleware";


const router: Router = express.Router();

router.get("/", authMiddleware,checkUserExist);

export default router;
