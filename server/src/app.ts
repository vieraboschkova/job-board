import cors from "cors";
import express from "express";
import { healthRoutes } from "./api/routes/healthRoutes";

export function createApp() {
  const app = express();

  if (process.env.NODE_ENV !== "production") {
    app.use(cors());
  }

  app.use(express.json());
  app.use("/api", healthRoutes);

  return app;
}
