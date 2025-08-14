import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import reviewRoutes from "./routes/review.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("Review service is running!");
});

app.listen(port, () => {
  console.log(`Review service listening on port ${port}`);
});
