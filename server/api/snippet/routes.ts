import { Router } from "express";
import {
  snippetPayloadSchema,
  validateBody,
} from "../middleware/validation";
import {
  getAllSnippets,
  getSnippet,
  createSnippet,
} from "../snippet/handler";

const router = Router();

router.post("/", validateBody(snippetPayloadSchema.create), createSnippet);

router.get("/:id", validateBody(snippetPayloadSchema.getOne), getSnippet);

router.get("/", getAllSnippets);

export default router;
