import compression from "compression";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { errorHandler } from "./api/middleware/error";
import routes from "./api/routes";

const PORT = Number.parseInt(process.env.PORT || "3000");

const app = express();

app.use(compression());
app.use(cors());
app.disable("x-powered-by");
app.use(morgan("tiny"));
app.use(express.json());

// Add your API routes here
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", routes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API Server is running on http://localhost:${PORT}`);
});
