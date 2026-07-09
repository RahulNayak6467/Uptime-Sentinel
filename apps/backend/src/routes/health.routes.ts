import express, { Router, Request, Response } from "express";
import cron from "node-cron";
const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "Express server is running" });
});

export default router;
