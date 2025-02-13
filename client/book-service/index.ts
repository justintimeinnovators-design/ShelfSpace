import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

const port = process.env.port || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Book Service intial endpoint");
});

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
