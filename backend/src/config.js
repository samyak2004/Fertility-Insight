import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT || 5000),
  mlServiceUrl: process.env.ML_SERVICE_URL || "http://localhost:8000",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
};
