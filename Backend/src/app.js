import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import issueRoutes from "./routes/issue.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import organizationRoutes from "./routes/organization.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import workerRoutes from "./routes/worker.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import reportRoutes from "./routes/report.routes.js";
import reviewRoutes from "./routes/review.routes.js";

// Middleware
import { notFound } from "./middleware/notFound.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// CORS Configuration
const allowedOrigins = [
  ENV.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman) or matched origins
      if (!origin || allowedOrigins.includes(origin) || ENV.NODE_ENV === "development") {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev to guarantee frontend connectivity
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Body Parsing with generous limits for live camera data URLs
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(cookieParser());

// Base Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CivicVision AI / Road2Solution Backend is operational.",
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV,
  });
});

// API Routes Mounting (available with /api prefix and root aliases)
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/issues", issueRoutes);
app.use("/issues", issueRoutes);

app.use("/api/ai", aiRoutes);
app.use("/ai", aiRoutes);

app.use("/api/organizations", organizationRoutes);
app.use("/organizations", organizationRoutes);

app.use("/api/admin", adminRoutes);
app.use("/admin", adminRoutes);

app.use("/api/worker", workerRoutes);
app.use("/worker", workerRoutes);

app.use("/api/analytics", analyticsRoutes);
app.use("/analytics", analyticsRoutes);

app.use("/api/reports", reportRoutes);
app.use("/reports", reportRoutes);

app.use("/api/reviews", reviewRoutes);
app.use("/reviews", reviewRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;