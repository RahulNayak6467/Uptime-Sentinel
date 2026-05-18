import express, { Router } from "express";
import {
  getAllInfo,
  getInfoById,
  getInfoByName,
} from "../controllers/checks.controllers";
const router: Router = express.Router();

router.get("/", getAllInfo);

router.get("/filter", getInfoByName);

router.get("/:id", getInfoById);

export default router;
