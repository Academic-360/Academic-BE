import mongoose from "mongoose";

const instituteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  refreshToken: { type: String }
});

export default mongoose.model("Institute", instituteSchema);
