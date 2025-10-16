import express, { Application, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import bodyParser from "body-parser";
import router from "./app/routes";
import GlobalErrorHandler from "./app/middlewares/globalErrorHandler";
import { webhookController } from "./helpars/stripe/StripeWebhook/webhookController";
import { initializeCronJobs } from "./app/jobs";

const app: Application = express();

// ✅ Updated CORS options with https://cudaspace.com
export const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    "http://172.252.13.76:3001",
    "https://cudaspace.com", // <-- Important
    "https://www.cudaspace.com",
    "https://api.cudaspace.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// ✅ Stripe webhook route (must be before express.json())
app.post(
  "/api/v1/package/webhooks/stripe",
  express.raw({ type: "application/json" }),
  webhookController.stripeWebhookHandler
);

// ✅ Middleware setup (order matters)
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // <-- Preflight handling
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// ✅ Root test route
app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "How's Project API",
  });
});

// ✅ Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ Main API routes
app.use("/api/v1", router);

// ✅ Global error handler
app.use(GlobalErrorHandler);

// ✅ Initialize cron jobs
initializeCronJobs();

// ✅ 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
