import type { Request, Response, NextFunction } from "express";
import axios from "axios";

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:3001";
const FORUM_SERVICE_URL = process.env.FORUM_SERVICE_URL || "http://localhost:3005";

/**
 * Is Authenticated.
 * @param req - req value.
 * @param res - res value.
 * @param next - next value.
 */
export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "A valid Bearer token is required for authentication",
    });
  }

  try {
    const response = await axios.post(
      `${USER_SERVICE_URL}/api/auth/verify`,
      {},
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );

    if (response.status === 200 && response.data.userId) {
      req.userId = response.data.userId;
      next();
    } else {
      return res.status(401).json({
        error: "Forbidden",
        message: "Your Authentication token is invalid or has expired",
      });
    }
  } catch (error) {
    console.error("Authentication Error: ", error);
    return res.status(401).json({
      error: "Forbidden",
      message: "Your Authentication token is invalid or has expired",
    });
  }
}

/**
 * Is Group Member.
 * @param req - req value.
 * @param res - res value.
 * @param next - next value.
 */
export async function isGroupMember(req: Request, res: Response, next: NextFunction) {
  const { groupId } = req.params;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const response = await axios.get(
      `${FORUM_SERVICE_URL}/api/forums/${groupId}/members/${userId}/verify`
    );

    if (response.status === 200 && response.data.isMember) {
      next();
    } else {
      return res.status(403).json({ error: "Forbidden" });
    }
  } catch (error) {
    console.error("Group Membership Verification Error: ", error);
    return res.status(403).json({ error: "Forbidden" });
  }
}
