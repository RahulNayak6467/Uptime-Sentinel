import express, { Router } from "express";
import { resendOTPMessage } from "../controllers/resendOTP.controllers";

const router: Router = express.Router();

router.post("/", resendOTPMessage);

export default router;
