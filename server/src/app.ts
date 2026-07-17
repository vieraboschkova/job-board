import cors from "cors";
import express from "express";

export function createApp() {
  const app = express();

  if (process.env.NODE_ENV !== "production") {
    app.use(cors());
  }

  app.use(express.json());

  return app;
}
