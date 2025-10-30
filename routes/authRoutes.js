import express from "express";
import {
  registerInstitute,
  loginInstitute,
  refreshAccessToken,
  logoutInstitute,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerInstitute);
router.post("/login", loginInstitute);
router.get("/refresh", refreshAccessToken);
router.post("/logout", logoutInstitute);

export default router;
