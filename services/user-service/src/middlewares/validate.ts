import type { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

/**
 * Validate.
 * @param schema - schema value.
 */
export const validate =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.issues, // Changed from error.errors to error.issues
        });
      }
      next(error);
    }
  };
