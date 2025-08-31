import express, { Router } from "express";
import snippets from "./snippet/routes";

const router: Router = express.Router();

router.use("/snippets", snippets);

export default router;
