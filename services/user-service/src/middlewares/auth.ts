import express from "express";
import type { Request, Response, NextFunction } from "express";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
const algorithm = "HS256";

interface CustomJWTPayload extends JWTPayload {
  id: string;
}

/**
 * Sign Token.
 * @param payload - payload value.
 */
export async function signToken(payload: { id: string }) {
  const token = new SignJWT(payload)
    .setProtectedHeader({ alg: algorithm })
    .setIssuedAt()
    .setExpirationTime("6h")
    .sign(secretKey);

  return token;
}

/**
 * Verify Token.
 * @param token - token value.
 */
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify<CustomJWTPayload>(token, secretKey, {
      algorithms: [algorithm],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Is Authenticated.
 * @param req - req value.
 * @param res - res value.
 * @param next - next value.
 */
export async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
      "FATAL ERROR: JWT_SECRET could not ber accssed from the enviorment variables"
    );

    return res.status(500).json({
      error: "Internal Server Error",
      message: "Server is not confiigured correctly for authentication",
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
    req.userId = payload.id;
    next();
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
}
