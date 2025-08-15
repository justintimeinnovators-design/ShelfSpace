import express from "express";
import cors from "cors";
import morgan from "morgan";
import adminRoutes from "./routes/admin.routes.ts";

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.send("Hello from Admin Service!");
});

app.use("/api/admin", adminRoutes);

app.listen(PORT, () => {
  console.log(`Admin service running at http://localhost:${PORT}`);
});
