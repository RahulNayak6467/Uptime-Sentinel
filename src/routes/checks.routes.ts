import express, { Router } from "express";
import {
  getAllInfo,
  getInfoById,
  getInfoByName,
} from "../controllers/checks.controllers";
import { authMiddleware } from "../middleware/auth.middleware";
const router: Router = express.Router();

router.get("/", authMiddleware, getAllInfo);

router.get("/filter", authMiddleware, getInfoByName);

router.get("/:id", authMiddleware, getInfoById);

export default router;
