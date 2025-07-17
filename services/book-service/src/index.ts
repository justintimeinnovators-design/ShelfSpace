import express from "express";
import cors from "cors";
import morgan from "morgan";
import { authenticateToken } from "./middlewares/auth.ts";
import bookRoutes from "./routes/book.routes.ts";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.send("Hello from Book Service!");
});

app.use("/api", authenticateToken, bookRoutes);

app.listen(PORT, () => {
  console.log(`Book service running at http://localhost:${PORT}`);
});
