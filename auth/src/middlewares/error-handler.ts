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
    return res.status(err.statusCode).send({
      errors: err.serializeErrors(),
    });
  }
  if (err instanceof DatabaseConnectionError) {
    return res.status(err.statusCode).send({
      errors: err.serializeErrors(),
    });
  }

  res.status(400).send({
    errors: [{ message: "Something went wrong" }],
  });
};
