import express from "express";
import cors from "cors";
import morgan from "morgan";
import { mockAuth } from "./middlewares/auth.ts";
import userRoutes from "./routes/user.routes.ts";
import preferencesRoutes from "./routes/prefrences.routes.ts";
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use(mockAuth);

app.use(userRoutes);
app.use(preferencesRoutes);

app.get("/", (_req, res) => {
  res.send("Hello from User Service!");
});

app.listen(PORT, () => {
  console.log(`User service running at http://localhost:${PORT}`);
});
