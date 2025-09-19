import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import { authenticateToken } from "./middlewares/auth.ts";
import bookRoutes from "./routes/book.routes.ts";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

try {
  // Retrieve the MongoDB connection string from environment variables
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.error("MONGO_URI is not defined in the .env file.");
    process.exit(1);
  }

  // Attempt to connect to the database
  const conn = await mongoose.connect(mongoURI);

  console.log(`Successfully connected to MongoDB: ${conn.connection.host}`);
} catch (error) {
  console.error(`Error connecting to MongoDB: ${error.message}`);
  // Exit process with failure code
  process.exit(1);
}

app.get("/", (_req, res) => {
  res.send("Hello from Book Service!");
});

app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
  console.log(`Book service running at http://localhost:${PORT}`);
});
