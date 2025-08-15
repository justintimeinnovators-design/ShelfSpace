import express from "express";
import type { Request, Response } from "express";
import { verifyToken } from "../middlewares/auth.ts";

const router = express.Router();

router.post("/verify", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "A valid Bearer token is required for authentication",
    });
  }
  const token = authHeader.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    console.error(
      "FATAL ERROR: JWT_SECRET could not be accessed from the environment variables"
    );
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Server is not configured correctly for authentication",
    });
  }

  try {
    const payload = await verifyToken(token);
    if (!payload) {
      return res.status(401).json({
        error: "Forbidden",
        message: "Your Authentication token is invalid or has expired",
      });
    }
    res.status(200).json({ userId: payload.id });
  } catch (error) {
    let errorMessage = "Your authentication token is invalid or has expired";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("JWT Verification Error: ", errorMessage);
    return res.status(401).json({
      error: "Forbidden",
      message: "Your Authentication token is invalid or has expired",
    });
  }
});

export default router;
