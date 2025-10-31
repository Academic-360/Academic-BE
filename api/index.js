import app from "../src/server.js";
import connectDB from "../src/config/db.js";

// connect to database
connectDB();

export default app;
