import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import APIError, { errorHandler } from "../middleware/error";

describe("Error handling middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      locals: {
        validated: { body: { text: "raw content" } },
      },
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  it("should hanlde APIError appropriately", () => {
    const error = new APIError(400, "Validation error");
    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Validation error",
    });
  });

  it("should handle unknown errors", () => {
    const error = new Error("Unknown error");

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Internal server error",
    });
  });
});
