import express, { Router } from "express";
import { generateAccessToken } from "../controllers/authRefresh.controllers";

const router: Router = express.Router();

router.post("/", generateAccessToken);

export default router;
