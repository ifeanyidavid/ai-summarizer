import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import APIError from "../middleware/error";

export const snippetPayloadSchema = {
  create: z.object({
    body: z.object({
      text: z.string(),
    }),
  }),
  getOne: z.object({
    params: z.object({
      id: z.string().min(1),
    }),
  }),
};

export const validateBody = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      res.locals.validated = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new APIError(400, error.issues[0].message));
      }
    }
  };
};
