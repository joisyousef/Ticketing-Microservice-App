import type { Request, Response, NextFunction } from "express";
import { RequestValidationError } from "../errors/request-validation.js";
import { DatabaseConnectionError } from "../errors/database-connection-error.js";

export const errorhandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof RequestValidationError) {
    const formattedErrors = err.errors.map((error) => {
      return { message: error.msg, field: "unknown" };
    });
    res.status(400).send({ errors: formattedErrors });
  }
  if (err instanceof DatabaseConnectionError) {
    return res.status(500).send({
      errors: [{ message: err.reason }],
    });
  }

  res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};
