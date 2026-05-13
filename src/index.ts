import express, { Request, Response, Application } from "express";

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({ message: "Express server is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
