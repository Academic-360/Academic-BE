import serverless from "serverless-http";
import app from "../app.js";

// Export a serverless handler for Vercel
export default serverless(app);
