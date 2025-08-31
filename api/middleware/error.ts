import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export default class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true,
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof APIError) {
    return res
      .status(err.statusCode)
      .json({ status: "error", message: err.message });
  }
  
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: "error",
    message: "Internal server error",
  });
};
