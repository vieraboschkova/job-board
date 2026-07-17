import path from "path";
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

  if (process.env.NODE_ENV === "production") {
    const distPath = path.join(__dirname, "..", "..", "client", "dist");
    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  return app;
}
