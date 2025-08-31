import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { AIFactory } from "../services/ai";
import SnippetService from "../snippet/service";
import APIError from "../middleware/error";

const aiService = AIFactory.getInstance().getAIService();
const snippetService = new SnippetService(aiService);

const getAllSnippets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const snippets = await snippetService.getAllSnippets();

    return res.status(StatusCodes.OK).json(snippets);
  } catch (error) {
    next(error);
  }
};

const getSnippet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const snippet = await snippetService.getSnippet(id);

    if (!snippet) {
      throw new APIError(StatusCodes.NOT_FOUND, "Snippet not found");
    }

    return res.status(StatusCodes.OK).json(snippet);
  } catch (error) {
    next(error);
  }
};

const createSnippet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { text }: { text: string | undefined } = res.locals.validated.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }
    const snippet = await snippetService.createSnippet(text);
    return res.status(StatusCodes.CREATED).json(snippet);
  } catch (error) {
    next(error);
  }
};

export { getAllSnippets, getSnippet, createSnippet };
