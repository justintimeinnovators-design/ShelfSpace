import express from "express";
import cors from "cors";
import morgan from "morgan";
import groupRoutes from "./routes/group.routes.ts";

const app = express();
const PORT = process.env.PORT || 3005; // Changed port

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.send("Hello from Group Service!");
});

app.use("/api/groups", groupRoutes);

app.listen(PORT, () => {
  console.log(`Group service running at http://localhost:${PORT}`);
});
