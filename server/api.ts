import compression from "compression";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { errorHandler } from "./api/middleware/error";
import routes from "./api/routes";

const PORT = Number.parseInt(process.env.API_PORT || "3000");

const app = express();

app.use(compression());
app.use(cors());
app.disable("x-powered-by");
app.use(morgan("tiny"));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", routes);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`API Server is running on http://localhost:${PORT}`);
});

const shutdown = async (signal: string) => {
  console.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.info("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("uncaughtException", (error) => {
  console.error("FATAL: Uncaught Exception! Shutting down.", { error });
  process.exit(1);
});
process.on("unhandledRejection", (reason) => {
  console.error("FATAL: Unhandled Rejection! Shutting down.", { reason });
  process.exit(1);
});
