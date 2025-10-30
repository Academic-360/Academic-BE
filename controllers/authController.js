import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Institute from "../models/instituteModel.js";

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

// Register
export const registerInstitute = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await Institute.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newInstitute = await Institute.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: "Institute registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
export const loginInstitute = async (req, res) => {
  try {
    const { email, password } = req.body;
    const institute = await Institute.findOne({ email });
    if (!institute) return res.status(404).json({ message: "Institute not found" });

    const isMatch = await bcrypt.compare(password, institute.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(institute);
    const refreshToken = generateRefreshToken(institute);

    institute.refreshToken = refreshToken;
    await institute.save();

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "strict",
      path: "/",
    });

    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Refresh Token
export const refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const institute = await Institute.findById(decoded.id);

    if (!institute || institute.refreshToken !== token)
      return res.status(403).json({ message: "Invalid refresh token" });

    const accessToken = generateAccessToken(institute);
    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: "Token expired or invalid" });
  }
};

// Logout
export const logoutInstitute = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(204);

  const institute = await Institute.findOne({ refreshToken: token });
  if (!institute) return res.sendStatus(204);

  institute.refreshToken = null;
  await institute.save();

  res.clearCookie("refreshToken", { path: "/" });
  res.json({ message: "Logged out successfully" });
};
