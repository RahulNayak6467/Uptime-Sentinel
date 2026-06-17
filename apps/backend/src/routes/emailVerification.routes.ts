import express, { Router } from "express";
import { handleEmailVerification } from "../controllers/emailVerification.controllers";

const router: Router = express.Router();

router.post("/", handleEmailVerification);

export default router;
