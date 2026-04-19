import cors from "cors";
import express from "express";
import morgan from "morgan";
import { config } from "./config.js";
import { requestPrediction } from "./services/mlClient.js";
import { normalizePayload } from "./utils/validation.js";

const app = express();

app.use(
  cors({
    origin: config.frontendOrigin,
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({
    name: "Fertility Insight Backend",
    status: "ok",
    endpoints: ["POST /predict"],
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "healthy" });
});

app.post("/predict", async (req, res) => {
  try {
    const payload = normalizePayload(req.body);
    const prediction = await requestPrediction(payload);

    res.json(prediction);
  } catch (error) {
    const statusCode = error.message.includes("must be") || error.message.includes("Request body")
      ? 400
      : 502;

    res.status(statusCode).json({
      error: error.message,
    });
  }
});

app.listen(config.port, () => {
  console.log(`Backend listening on http://localhost:${config.port}`);
});
