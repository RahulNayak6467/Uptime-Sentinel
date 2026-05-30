import express, { Router } from "express";
import { Request, Response } from "express";
import cron from "node-cron";
const router: Router = express.Router();

const sendCronMessage = () => {
  console.log(`The cron job is running at ${Date.now()}`);
};

router.get("/", (req: Request, res: Response) => {
  //   cron.schedule("* * * * *", () => {
  //     sendCronMessage();
  //   });
  return res.status(200).json({
    message: "Cron job working",
  });
});

export default Router;
