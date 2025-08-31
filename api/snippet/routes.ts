import { Router } from "express";
import { snippetPayloadSchema, validateBody } from "../middleware/validation.js";
import { createSnippet, getAllSnippets, getSnippet } from "./handler.js";

const router = Router();

router.post("/", validateBody(snippetPayloadSchema.create), createSnippet);

router.get("/:id", validateBody(snippetPayloadSchema.getOne), getSnippet);

router.get("/", getAllSnippets);

export default router;
