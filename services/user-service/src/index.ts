import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.ts";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.send("Hello from User Service!");
});

app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`User service running at http://localhost:${PORT}`);
});
