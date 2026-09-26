import express from "express";
import downloadHandler from "./download.ts";
import jobsHandler from "./jobs/[id].ts";
import downloadStreamHandler from "./jobs/[id]/download.ts";
import healthHandler from "./health.ts";
import samplesHandler from "./samples.ts";
import { setupAdminRoutes } from "../server/adminRoutes.ts";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Set CORS
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Admin-Token");
  if (_req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Setup Admin CMS API routes
setupAdminRoutes(app);

// Download handlers
app.all("/api/download", (req, res) => downloadHandler(req, res));
app.all("/download", (req, res) => downloadHandler(req, res));

// Health & Samples
app.get("/api/health", (req, res) => healthHandler(req, res));
app.get("/health", (req, res) => healthHandler(req, res));
app.get("/api/samples", (req, res) => samplesHandler(req, res));
app.get("/samples", (req, res) => samplesHandler(req, res));

// Job download stream
app.all("/api/jobs/:id/download", (req, res) => downloadStreamHandler(req, res));
app.all("/jobs/:id/download", (req, res) => downloadStreamHandler(req, res));

// Job status
app.all("/api/jobs/:id", (req, res) => jobsHandler(req, res));
app.all("/jobs/:id", (req, res) => jobsHandler(req, res));

export default app;
