import express, { Router, Request, Response } from "express";
import { loginUser } from "../controllers/login.controllers";

const router: Router = express.Router();

router.post("/", loginUser);

export default router;
