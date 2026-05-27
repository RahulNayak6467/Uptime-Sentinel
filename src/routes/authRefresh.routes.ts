import express, { Router } from "express";
import { generateAccessToken } from "../controllers/authRefresh.controllers";
import { ro } from "zod/v4/locales";

const router: Router = express.Router();

router.post("/", generateAccessToken);

export default router;
