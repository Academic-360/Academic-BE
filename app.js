import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

// Initialize app
const app = express();


connectDB();

// Middleware
const corsOrigin = process.env.FRONTEND_ORIGIN || true; // reflect origin in dev, restrict in prod via env
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes (mount for both local and Vercel serverless pathing)
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

export default app;
