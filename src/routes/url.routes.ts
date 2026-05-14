import express, { Router } from "express";
import { monitorUrl } from "../controllers/url.controllers";
const router: Router = express.Router();

router.post("/", monitorUrl);
export default router;
