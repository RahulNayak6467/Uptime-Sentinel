import express, { Router } from "express";
import {
  getAllInfo,
  getInfoById,
  getInfoByName,
} from "../controllers/checks.controllers";
import { authMiddleware } from "../../../../shared/middleware/auth.middleware";
const router: Router = express.Router();

router.get("/", authMiddleware, (req, res, next) => {
  if (req.query.url) {
    return getInfoByName(req, res, next);
  }
  return getAllInfo(req, res, next);
});

router.get("/:checkId", authMiddleware, getInfoById);

export default router;
