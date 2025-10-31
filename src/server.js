import express from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
connectDB();


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.json({ status: "success", message: "Backend is running2" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "success", message: "Backend is running (local)" });
});

app.use("/api/auth", authRoutes);
// app.use("/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Academic360 app running on port ${PORT}`);
});


export default app;
