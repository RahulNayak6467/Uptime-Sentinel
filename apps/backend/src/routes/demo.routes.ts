import express, { Router } from "express";
import { Request, Response } from "express";
import cron from "node-cron";
const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => {
  //   cron.schedule("* * * * *", () => {
  //     sendCronMessage();
  //   });
  return res.status(200).json({
    message: "Cron job working",
  });
});

export default Router;
