import express, { Request, Response, Application } from "express";
import { env } from "./config/env";
import healthRouter from "./routes/health.routes";
import urlHealth from "./routes/url.routes";

const app: Application = express();
const PORT = env.PORT || 3000;

app.use(express.json());

app.use("/health", healthRouter);
app.use("/url/health", urlHealth);

app.listen(PORT, () => {
  //   console.log(`Server is running at PORT ${PORT}`);
});
