import express, { Router, Request, Response } from "express";
import { handleUser } from "../controllers/users.controllers";
const router: Router = express.Router();

router.post("/", handleUser);

export default router;
