import express from "express";

export const mockAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  req.user = { id: "mock-user-id" };
  next();
};
