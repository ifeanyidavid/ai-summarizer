import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";
import APIError from "../middleware/error";
import * as handler from "./handler";
import SnippetService from "./service";
import "../__mocks__/ai";

vi.mock("./service");

describe("Snippet handlers", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      params: { id: "123" },
    };
    res = {
      locals: {
        validated: { body: { text: "raw content" } },
      },
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  describe("createSnippet", () => {
    it("should create a snippet and return id, text, summary", async () => {
      const mockSnippet = {
        id: "123",
        text: "raw content",
        summary: "raw content summary",
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(SnippetService.prototype.createSnippet).mockResolvedValueOnce(
        mockSnippet
      );

      await handler.createSnippet(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith(mockSnippet);
    });

    it("should handle errors", async () => {
      const error = new APIError(400, "error message");
      vi.mocked(SnippetService.prototype.createSnippet).mockRejectedValueOnce(
        error
      );
      await handler.createSnippet(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    it("should handle AI service errors", async () => {
      const error = new Error("AI error");
      vi.mocked(SnippetService.prototype.createSnippet).mockRejectedValueOnce(
        error
      );

      await handler.createSnippet(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getSnippet", () => {
    it("should get a snippet by id", async () => {
      const mockSnippet = {
        id: "123",
        text: "raw content",
        summary: "raw content summary",
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(SnippetService.prototype.getSnippet).mockResolvedValueOnce(
        mockSnippet
      );

      await handler.getSnippet(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockSnippet);
    });

    it("should return 404 for missing snippet", async () => {
      vi.mocked(SnippetService.prototype.getSnippet).mockResolvedValueOnce(
        null
      );

      await handler.getSnippet(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(APIError));
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: StatusCodes.NOT_FOUND,
          message: "Snippet not found",
        })
      );
    });

    it("should handle database errors", async () => {
      const error = new Error("Database error");
      vi.mocked(SnippetService.prototype.getSnippet).mockRejectedValueOnce(
        error
      );

      await handler.getSnippet(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getAllSnippets", () => {
    it("should list all snippets", async () => {
      const mockSnippets = [
        {
          id: "123",
          text: "raw content",
          summary: "raw content summary",
          published: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "456",
          text: "another raw content",
          summary: "another raw content summary",
          published: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(SnippetService.prototype.getAllSnippets).mockResolvedValueOnce(
        mockSnippets
      );

      await handler.getAllSnippets(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(mockSnippets);
    });

    it("should handle database errors", async () => {
      const error = new Error("Database error");
      vi.mocked(SnippetService.prototype.getAllSnippets).mockRejectedValueOnce(
        error
      );

      await handler.getAllSnippets(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("Error handling", () => {
    it("should convert unknown errors to APIErrors", async () => {
      const unknownError = new Error("Unknown error");
      vi.mocked(SnippetService.prototype.getAllSnippets).mockRejectedValueOnce(
        unknownError
      );

      await handler.getAllSnippets(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should preserve APIError status codes", async () => {
      const apiError = new APIError(
        StatusCodes.BAD_REQUEST,
        "Validation failed"
      );
      vi.mocked(SnippetService.prototype.createSnippet).mockRejectedValueOnce(
        apiError
      );

      await handler.createSnippet(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: StatusCodes.BAD_REQUEST,
          message: "Validation failed",
        })
      );
    });
  });
});
