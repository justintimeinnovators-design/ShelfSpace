import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

dotenv.config();
const app: Express = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_DATABASE_URL as string)
  .then(() => console.log("DATABASE CONNECTED"))
  .catch((err) => console.log(err));

app.get("/", (req: Request, res: Response) => {
  res.send("Book Service root endpoint");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
